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
import { FieldError, MyContext } from "../types";
import { verifyUser } from "../utils/verifyUser";
import { User } from "../entities/User";

@Resolver(Post)
@InputType()
class postsInput {
  @Field(() => [String], { nullable: true })
  topic?: string[];
  @Field()
  scrolledDown: number;
  @Field()
  sortBy: string;
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

@ObjectType()
class postsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [Post], { nullable: true })
  posts?: [Post];
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

  @Query(() => postsResponse)
  async paginatedPosts(
    @Arg("inputs") inputs: postsInput,
    @Ctx() { res }: MyContext
  ): Promise<postsResponse> {
    // i aint dont this yet

    const selectionAmount = 25;
    let skip = (inputs.scrolledDown - 1) * selectionAmount;
    let [posts, total]: [Post[], number] = await conn.manager.findAndCount(
      Post,
      {
        skip,
        take: selectionAmount,
      }
    );
    return {
      errors: [
        { field: "No error", error: "check console . log please baebs" },
      ],
    };
  }

  @Mutation(() => aPostResponse)
  async createPost(
    @Arg("inputs") inputs: createPostInput,
    @Ctx() { req }: MyContext
  ): Promise<aPostResponse> {
    // Maybe do some checks on the form data.

    if (!req.headers["authorization"]) {
      return { errors: [{ field: "user", error: "User not logged in" }] };
    }

    let user = await verifyUser(req.headers["authorization"]!);
    console.log(user.errors?.length);
    if (typeof user.errors == undefined) {
      return { errors: user.errors };
    }
    let newPost = new Post();
    newPost.title = inputs.title;
    newPost.description = inputs.description;
    newPost.topic = inputs.topic;
    newPost.ranking = 0;
    newPost.user = user.user!;

    let post = await conn.manager.save(Post, newPost);
    user.user?.posts?.push(post);
    await conn.manager.save(User, user.user!);

    return { post: newPost };
  }
}
