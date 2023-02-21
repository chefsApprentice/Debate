import { Argument } from "../entities/Argument";
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
import { conn } from "..";
import { User } from "../entities/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyUser } from "../utils/verifyUser";

@Resolver(Argument)
@InputType()
class createArgumentInput {
  @Field()
  title: string;
  @Field()
  type: string;
  @Field(() => [String])
  points: string[];
  @Field(() => [Number])
  references: number[];
  @Field()
  postId: number;
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
class anArgumentResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Argument, { nullable: true })
  argument?: Argument;
}
class argumentsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [Argument], { nullable: true })
  arguments?: Argument[];
}
export class ArgumentResolver {
  //   @Query(() => argumentsResponse)
  //   async argumentsTyped(
  //     @Arg("inputs") inputs: argumentsTypedInputs
  //   ): Promise<argumentsResponse> {
  //     const argRepo = conn.getRepository(Argument);
  //     const args = await argRepo.find({
  //         // where: { : inputs.postId },
  //       relations: { post: { id: true }, user: true },
  //     });
  //     return {};
  //   }

  @Mutation(() => anArgumentResponse)
  async createArgument(
    @Arg("inputs") inputs: createArgumentInput,
    @Ctx() { req }: MyContext
  ): Promise<anArgumentResponse> {
    let userOrError = await verifyUser(req.headers["authorization"]!);
    if (typeof userOrError.errors == undefined) {
      return { errors: userOrError.errors };
    }

    let userId: JwtPayload = <JwtPayload>(
      await jwt.verify(req.headers["authorization"]!, process.env.HASH_JWT!)
    );

    let userRepo = await conn.getRepository(User);
    let user = await userRepo.findOne({
      where: { id: userId.userId! },
      relations: { arguments: true },
    });
    let postRepo = await conn.getRepository(Post);
    let post = await postRepo.findOne({
      where: { id: inputs.postId! },
      relations: { arguments: true },
    });
    if (!post) {
      return {
        errors: [{ field: "postId", error: "That post doesn't exist" }],
      };
    }

    let newArgument: any = {
      title: inputs.title,
      type: inputs.type,
      points: inputs.points,
      ranking: 0,
      references: inputs.references,
      referencedBy: [],
      user: user,
      post: post,
    };

    let argumentRepo = await conn.getRepository(Argument);
    let argument = await argumentRepo.save(argumentRepo.create(newArgument));

    user!.arguments?.push(<Argument>(<unknown>argument));
    await userRepo.save(user!);
    post!.arguments?.push(<Argument>(<unknown>argument));
    await postRepo.save(post!);

    let referenceError = [];
    for (let i = 0; i != inputs.references.length; i++) {
      // Might wanta to do find all wehre id mathces references
      //isntead of doing a query each time
      let referencedArg = await argumentRepo.findOne({
        where: { id: inputs.references[i] },
      });
      if (!referencedArg) {
        let errorString =
          "argument of id: " +
          <string>(<unknown>inputs.references[i]) +
          " doesn't exist.";
        referenceError.push({
          field: "references",
          error: errorString,
        });
      }
      referencedArg!.referencedBy.push((<Argument>(<unknown>argument!)).id);
      argumentRepo.save(referencedArg!);
    }
    if (referenceError.length >= 1) {
      return {
        argument: <Argument>(<unknown>argument),
        errors: referenceError,
      };
    }

    return { argument: <Argument>(<unknown>argument) };
  }
}
