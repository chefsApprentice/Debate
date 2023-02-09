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
    let posts = await conn.manager.find(Post);
    return posts;
  }

  @Query(() => postsResponse)
  async paginatedPosts(
    @Arg("inputs") inputs: postsInput,
    @Ctx() { res }: MyContext
  ): Promise<postsResponse> {
    const selectionAmount = 25;
    let skip = (inputs.scrolledDown - 1) * selectionAmount;
    let [posts, total]: [Post[], number] = await conn.manager.findAndCount(
      Post,
      {
        skip,
        take: selectionAmount,
      }
    );
    console.log("psots", posts!, total);
    return {
      errors: [
        { field: "No error", error: "check console . log please baebs" },
      ],
    };
  }

  // @Mutation(() => aPostResponse)
  // async createPost(
  //   @Arg("inputs") inputs: createPostInput,
  //   @Ctx() { req }: MyContext
  // ): Promise<aPostResponse> {
  //   // Maybe do some checks on the form data.

  //   // U nered login to work so u can fucking log in
  //   // let user =
  //   console.log("req headers be like:", req.headers["authorization"]);
  //   if (false) {
  //     return { errors: [{ field: "user", error: "User not logged in." }] };
  //   }

  //   let newPost = new Post();
  //   newPost.title = inputs.title;
  //   newPost.description = inputs.description;
  //   newPost.topic = inputs.topic;

  //   await conn
  //     .createQueryBuilder()
  //     .relation(Post, "user")
  //     .of(newPost)
  //     .add(user);
  // }
}
