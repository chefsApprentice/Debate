import { User } from "../entities/User";
// import { FieldError, MyContext } from "../types";
import { FieldError } from "../types";
import {
  Arg,
  // Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { validateRegister } from "../utils/validateRegister";
import "../../.env";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { conn } from "../index";

@Resolver(User)
@InputType()
export class loginInput {
  @Field()
  usernameOrEmail: string;
  @Field()
  password: string;
}

@InputType()
export class registerInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  confirmPassword: string;
}

@ObjectType()
class userResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

export class UserResolver {
  @Query(() => String)
  hello() {
    console.log("nani");
    return "bye";
  }

  @Mutation(() => userResponse)
  async register(
    @Arg("inputs") inputs: registerInput
    // @Ctx() { req }: MyContext
  ): Promise<userResponse> {
    console.log("decorum");
    let errors = validateRegister(inputs);
    console.log("errors:", errors);
    if (errors.length != 0) {
      return { errors };
    }
    console.log("we must be hanigng");
    //unlike validating the register this is not repettive so should stay in the main func
    let user = await User.findOne({ where: { username: inputs.username } });
    if (user) {
      return {
        errors: [
          {
            field: "username",
            error: "Username is taken",
          },
        ],
      };
    }
    user = await User.findOne({ where: { email: inputs.email } });
    if (user) {
      return {
        errors: [
          {
            field: "email",
            error: "Account found, try logging in.",
          },
        ],
      };
    }

    console.log(1);
    const hashedPassword = await bcrypt.hash(inputs.password, 10);

    console.log(2);
    const token = await jwt.sign(
      { username: inputs.username },
      <string>process.env.HASH_JWT,
      {
        expiresIn: "14d",
      }
    );
    console.log(3);
    // const result = await User.insert({
    //   email: inputs.email,
    //   username: inputs.username,
    //   password: hashedPassword,
    //   token: token,
    // });

    const newUser = new User();
    newUser.email = inputs.email;
    newUser.username = inputs.username;
    newUser.password = hashedPassword;
    newUser.token = token;

    await conn.manager.save(newUser);

    console.log(4);
    // const result = await getConnection()
    //   .createQueryBuilder()
    //   .insert()
    //   .into(User)
    //   .values({
    //     email: inputs.email,
    //     username: inputs.username,
    //     password: hashedPassword,
    //     token: token,
    //   })
    //   .execute();

    console.log("wtf");
    console.log("newUser id", newUser.id);
    return { user: user! };

    // req.session.userId = user.id;
    // req.session.save();

    // hash password and create an account
  }
}
