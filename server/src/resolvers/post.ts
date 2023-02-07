import { conn } from "../index";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Post } from "../entities/Post";
import { FieldError, MyContext } from "src/types";

@Resolver(Post)
@InputType()
class postsInput {
  @Field(() => [String], { nullable: true })
  topic?: string[];
  @Field()
  scrolledDown: number;
}

@ObjectType()
class postsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [Post], { nullable: true })
  posts?: [Post];
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
    let posts = await conn.manager.findAndCount(Post, {});
  }
}
