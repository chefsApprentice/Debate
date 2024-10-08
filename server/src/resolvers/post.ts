import { conn } from "../index";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Post } from "../entities/Post";
import {
  boolError,
  FieldError,
  MyContext,
  OperationFieldResponse,
  rateInput,
} from "../types";
import { verifyUser } from "../utils/verifyUser";
import { User } from "../entities/User";
import { orderSwitch, outputTopics } from "../utils/paginated Utils";
import { FindOptionsOrder } from "typeorm";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { Argument } from "../entities/Argument";

@Resolver(Post)
@InputType()
class postsInput {
  @Field(() => [String], { nullable: true })
  topics?: string[];
  @Field()
  scrolledDown: number;
  @Field(() => [String])
  sortBy: string[];
}

@InputType()
class createPostInput {
  @Field()
  topic: string;
  @Field()
  title: string;
  @Field()
  description: string;
}

@InputType()
class postIdClass {
  @Field()
  postId!: number;
}

// @InputType()
// class argumentsTypedInputs {
//   @Field()
//   postId: number;
//   @Field()
//   type: string;
//   @Field()
//   cursor: number;
// }

@ObjectType()
class postsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}

@ObjectType()
class aPostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Post, { nullable: true })
  post?: Post;
}

export class PostResolver {
  @Query(() => [Post])
  async getPosts() {
    // let posts = await conn.manager.find(Post);
    const postRepo = conn.getRepository(Post);
    const posts = await postRepo.find({
      relations: {
        user: true,
      },
    });
    return posts;
  }

  // Customsiable inputs for continously loading posts in a paginated way
  @Query(() => postsResponse)
  async paginatedPosts(
    @Arg("inputs") inputs: postsInput
  ): Promise<postsResponse> {
    // Turn order variables from string to whitelisted dictionairy using switch func
    let order = orderSwitch(inputs.sortBy[0], inputs.sortBy[1]);
    // The amount of posts selected by each query
    const selectionAmount = 20;
    let skip = inputs.scrolledDown * selectionAmount;

    const postRepo = conn.getRepository(Post);
    // Variables for query
    let repoVar: any = {
      skip,
      take: selectionAmount,
      // using the order variable, ensuring it is in the correct type
      order: <FindOptionsOrder<Post>>order!,
      // Allows graphQL to select user data, in this case only username
      relations: {
        user: true,
      },
    };

    // if there are no topics in inputs, include all topics in query so dont add var.
    if (typeof inputs.topics !== undefined && inputs.topics?.length!) {
      repoVar.where = outputTopics(inputs.topics!);
    }

    // __ means unused var, as we do not need to know how many posts match
    const [posts, __]: [Post[], number] = await postRepo.findAndCount(repoVar);
    return {
      posts: posts!,
    };
  }

  @Query(() => aPostResponse)
  async fetchPost(@Arg("inputs") postId: postIdClass) {
    const postRepo = conn.getRepository(Post);
    const post = await postRepo.findOne({
      where: { id: postId.postId },
      relations: {
        user: true,
        arguments: { user: true },
      },
    });
    if (!post) {
      return {
        errors: [{ field: "postId", error: "That post doesn't exist" }],
      };
    }
    return { post };
  }

  @Mutation(() => aPostResponse)
  async createPost(
    @Arg("inputs") inputs: createPostInput,
    @Ctx() { req }: MyContext
  ): Promise<aPostResponse> {
    // Maybe do some checks on the form data.
    // All data should be lowercase please

    let userOrError = await verifyUser(req.headers["authorization"]!);
    if (typeof userOrError.errors == undefined) {
      return { errors: userOrError.errors };
    }
    // cannot use the user from verify user as we ened the post relation
    let userId: JwtPayload = <JwtPayload>(
      await jwt.verify(req.headers["authorization"]!, process.env.HASH_JWT!)
    );
    let userRepo = await conn.getRepository(User);
    let user = await userRepo.findOne({
      where: { id: userId.userId! },
      relations: { posts: true },
    });

    let newPost: any = {
      title: inputs.title,
      description: inputs.description,
      topic: inputs.topic,
      ranking: 0,
      user: user,
      arguments: [],
    };

    let postRepo = await conn.getRepository(Post);
    let post = await postRepo.save(postRepo.create(newPost));

    // let post = await conn.manager.save(Post, newPost);
    user!.posts?.push(<Post>(<unknown>post));
    await userRepo.save(user!);

    return { post: <Post>(<unknown>post) };
  }

  @Mutation(() => aPostResponse)
  async ratePost(
    @Arg("inputs") inputs: rateInput,
    @Ctx() { req }: MyContext
  ): Promise<aPostResponse> {
    let userOrError = await verifyUser(req.headers["authorization"]!);
    if (userOrError.errors) {
      return { errors: userOrError.errors };
    }
    let user = userOrError.user;

    let post = await conn.manager.findOne(Post, {
      where: { id: inputs.targetId },
    });
    if (!post) {
      return {
        errors: [{ field: "post_id", error: "Post doesn't exist" }],
      };
    }

    let dir = 0;
    if (inputs.direction == "up") {
      dir = 1;
      let likesId = user!.likes?.indexOf(inputs.targetId);
      if (likesId! > -1) {
        post.ranking -= 1;
        user?.likes!.splice(likesId!);
        await conn.manager.save(User, user!);
        await conn.manager.save(Post, post);
        return { post };
      }
      let dislikesId = user!.dislikes?.indexOf(inputs.targetId);
      if (dislikesId! > -1) {
        post.ranking += 2;
        user?.dislikes!.splice(likesId!);
        user?.likes?.push(inputs.targetId);
        await conn.manager.save(User, user!);
        await conn.manager.save(Post, post);
        return { post };
      }
      post.ranking += dir;
      user?.likes?.push(inputs.targetId);
      await conn.manager.save(User, user!);
      await conn.manager.save(Post, post);
      return { post };
    } else if (inputs.direction == "down") {
      dir = -1;
      let likesId = user!.likes?.indexOf(inputs.targetId);
      if (likesId! > -1) {
        post.ranking -= 2;
        user?.likes!.splice(likesId!);
        user?.dislikes?.push(inputs.targetId);
        await conn.manager.save(User, user!);
        await conn.manager.save(Post, post);
        return { post };
      }
      let dislikesId = user!.dislikes?.indexOf(inputs.targetId);
      if (dislikesId! > -1) {
        post.ranking += 1;
        user?.dislikes!.splice(likesId!);
        await conn.manager.save(User, user!);
        await conn.manager.save(Post, post);
        return { post };
      }
      post.ranking += dir;
      user?.dislikes?.push(inputs.targetId);
      await conn.manager.save(User, user!);
      await conn.manager.save(Post, post);
      return { post };
    } else {
      return {
        errors: [{ field: "direction", error: "Invalid direction" }],
      };
    }
  }

  @Mutation(() => boolError)
  async deletePost(
    @Arg("inputs") postId: postIdClass,
    @Ctx() { req }: MyContext
  ): Promise<boolError> {
    let userOrError = await verifyUser(req.headers["authorization"]!);
    if (userOrError.errors) {
      return { errors: userOrError.errors };
    } else if (!userOrError.user) {
      return { errors: [{ field: "user", error: "No user!" }] };
    }
    let user = userOrError.user;

    let postRepo = await conn.getRepository(Post);
    let argRepo = await conn.getRepository(Argument);
    try {
      let post = await postRepo.findOne({
        where: { id: postId.postId, user: { id: user!.id } },
        relations: { arguments: true },
      });

      if (!post) {
        return { errors: [{ error: "No post", field: "postId" }] };
      }

      let oldArgArr = post!.arguments;
      for (let i = 0; i < oldArgArr!.length; i++) {
        argRepo.delete({ id: oldArgArr![i].id });
      }
      let postReturned = await postRepo.remove(post!);
      if (!postReturned) {
        return { success: false };
      } else {
        return { success: true };
      }
    } catch (e) {
      return { errors: [{ error: e, field: "Proabably_user" }] };
    }
  }
}
