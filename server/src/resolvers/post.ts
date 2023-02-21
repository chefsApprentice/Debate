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
import { FieldError, MyContext, OperationFieldResponse } from "../types";
import { verifyUser } from "../utils/verifyUser";
import { User } from "../entities/User";
import { orderSwitch, outputTopics } from "../utils/paginated Utils";
import { FindOptionsOrder } from "typeorm";
import jwt, { JwtPayload } from "jsonwebtoken";

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
class rateInput {
  @Field()
  postId!: number;
  @Field()
  direction!: string;
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
    const selectionAmount = 25;
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
      console.log("bad");
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

    console.log("what");
    let post = await conn.manager.findOne(Post, {
      where: { id: inputs.postId },
    });
    if (!post) {
      return {
        errors: [{ field: "post_id", error: "Post doesn't exist" }],
      };
    }

    let dir = 0;
    if (inputs.direction == "up") {
      dir = 1;
      let likesId = user!.likes?.indexOf(inputs.postId);
      if (likesId! > -1) {
        post.ranking -= 1;
        user?.likes!.splice(likesId!);
        await conn.manager.save(User, user!);
        await conn.manager.save(Post, post);
        return { post };
      }
      let dislikesId = user!.dislikes?.indexOf(inputs.postId);
      if (dislikesId! > -1) {
        post.ranking += 2;
        user?.dislikes!.splice(likesId!);
        user?.likes?.push(inputs.postId);
        await conn.manager.save(User, user!);
        await conn.manager.save(Post, post);
        return { post };
      }
      post.ranking += dir;
      user?.likes?.push(inputs.postId);
      await conn.manager.save(User, user!);
      await conn.manager.save(Post, post);
      return { post };
    } else if (inputs.direction == "down") {
      dir = -1;
      let likesId = user!.likes?.indexOf(inputs.postId);
      if (likesId! > -1) {
        post.ranking -= 2;
        user?.likes!.splice(likesId!);
        user?.dislikes?.push(inputs.postId);
        await conn.manager.save(User, user!);
        await conn.manager.save(Post, post);
        return { post };
      }
      let dislikesId = user!.dislikes?.indexOf(inputs.postId);
      if (dislikesId! > -1) {
        post.ranking += 1;
        user?.dislikes!.splice(likesId!);
        await conn.manager.save(User, user!);
        await conn.manager.save(Post, post);
        return { post };
      }
      post.ranking += dir;
      user?.dislikes?.push(inputs.postId);
      await conn.manager.save(User, user!);
      await conn.manager.save(Post, post);
      return { post };
    } else {
      return {
        errors: [{ field: "direction", error: "Invalid direction" }],
      };
    }
  }
}
