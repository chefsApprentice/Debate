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
import { boolError, FieldError, MyContext, rateInput } from "../types";
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

@InputType()
class argumentIdClass {
  @Field()
  argId!: number;
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
  @Query(() => anArgumentResponse)
  async fetchArgument(
    @Arg("inputs") inputs: argumentIdClass
  ): Promise<anArgumentResponse> {
    const argRepo = conn.getRepository(Argument);
    const argument = await argRepo.findOne({
      where: { id: inputs.argId },
      relations: {
        user: true,
        post: { user: true },
      },
    });
    if (!argument) {
      return {
        errors: [{ field: "argId", error: "That argument doesn't exist" }],
      };
    }
    return { argument };
  }

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
    if (userOrError.errors) {
      return { errors: userOrError.errors };
    }

    // Verify inputs
    switch (inputs.type) {
      case "for":
        break;
      case "against":
        break;
      case "rejoinder":
        break;
      default:
        return {
          errors: [{ field: "type", error: "Not one of the accepted types" }],
        };
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
        continue;
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

  // could add the ability to update and reference other args,
  // but this is done in the create anyway soooo
  // @Mutation(() => argumentsResponse)
  // async referenceArgument

  @Mutation(() => anArgumentResponse)
  async rateArgument(
    @Arg("inputs") inputs: rateInput,
    @Ctx() { req }: MyContext
  ): Promise<anArgumentResponse> {
    let userOrError = await verifyUser(req.headers["authorization"]!);
    if (userOrError.errors) {
      return { errors: userOrError.errors };
    }
    let user = userOrError.user;

    let argument = await conn.manager.findOne(Argument, {
      where: { id: inputs.targetId },
    });
    if (!argument) {
      return {
        errors: [{ field: "targetId", error: "Argument doesn't exist" }],
      };
    }

    let dir = 0;
    if (inputs.direction == "up") {
      dir = 1;
      let likesId = user!.argLikes?.indexOf(inputs.targetId);
      if (likesId! > -1) {
        argument.ranking -= 1;
        user?.argLikes!.splice(likesId!);
        await conn.manager.save(User, user!);
        await conn.manager.save(Argument, argument);
        return { argument };
      }
      let dislikesId = user!.argDislikes?.indexOf(inputs.targetId);
      if (dislikesId! > -1) {
        argument.ranking += 2;
        user?.argDislikes!.splice(likesId!);
        user?.argLikes?.push(inputs.targetId);
        await conn.manager.save(User, user!);
        await conn.manager.save(Argument, argument);
        return { argument };
      }
      argument.ranking += dir;
      user?.argLikes?.push(inputs.targetId);
      await conn.manager.save(User, user!);
      await conn.manager.save(Argument, argument);
      return { argument };
    } else if (inputs.direction == "down") {
      dir = -1;
      let likesId = user!.argLikes?.indexOf(inputs.targetId);
      if (likesId! > -1) {
        argument.ranking -= 2;
        user?.argLikes!.splice(likesId!);
        user?.argDislikes?.push(inputs.targetId);
        await conn.manager.save(User, user!);
        await conn.manager.save(Argument, argument);
        return { argument };
      }
      let dislikesId = user!.argDislikes?.indexOf(inputs.targetId);
      if (dislikesId! > -1) {
        argument.ranking += 1;
        user?.argDislikes!.splice(likesId!);
        await conn.manager.save(User, user!);
        await conn.manager.save(Argument, argument);
        return { argument };
      }
      argument.ranking += dir;
      user?.argDislikes?.push(inputs.targetId);
      await conn.manager.save(User, user!);
      await conn.manager.save(Argument, argument);
      return { argument };
    } else {
      return {
        errors: [{ field: "direction", error: "Invalid direction" }],
      };
    }
  }

  @Mutation(() => boolError)
  async deleteArgument(
    @Arg("inputs") argId: argumentIdClass,
    @Ctx() { req }: MyContext
  ): Promise<boolError> {
    let userOrError = await verifyUser(req.headers["authorization"]!);
    if (userOrError.errors) {
      return { errors: userOrError.errors };
    } else if (!userOrError.user) {
      return { errors: [{ field: "user", error: "No user!" }] };
    }
    let user = userOrError.user;
    let argRepo = await conn.getRepository(Argument);
    try {
      let success = await argRepo.delete({
        id: argId.argId,
        user: { id: user!.id },
      });
      if (success.affected == 1) {
        return { success: true };
      } else if (success.affected == 0) {
        return { success: false };
      }
    } catch (e) {
      return { errors: [{ error: e, field: "Proabably_user" }] };
    }
    return { success: false };
  }
}
