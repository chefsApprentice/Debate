import { User } from "../entities/User";
// import { FieldError, MyContext } from "../types";
import { FieldError, MyContext } from "../types";
import {
  Arg,
  Ctx,
  // Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { validateRegistration } from "../utils/validateRegistration";
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
    return "bye";
  }

  // only for development
  @Query(() => [User])
  async getUsers() {
    let users = await conn.manager.find(User);
    return users;
  }

  @Mutation(() => userResponse)
  async register(
    @Arg("inputs") inputs: registerInput,
    @Ctx() { res }: MyContext
  ): Promise<userResponse> {
    let errors = validateRegistration(inputs);
    if (errors.length != 0) {
      return { errors };
    }
    //unlike validating the register this is not repettive so should stay in the main func
    let user = await conn.manager.findOneBy(User, {
      username: inputs.username,
    });
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
    user = await conn.manager.findOneBy(User, {
      email: inputs.email,
    });
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

    const hashedPassword = await bcrypt.hash(inputs.password, 10);

    const token = await jwt.sign(
      { username: inputs.username },
      <string>process.env.HASH_JWT,
      {
        expiresIn: "14d",
      }
    );
    res.cookie("uid", token, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

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

    return { user: newUser! };

    // req.session.userId = user.id;
    // req.session.save();

    // hash password and create an account
  }

  @Mutation(() => userResponse)
  async login(
    @Arg("inputs") inputs: loginInput,
    @Ctx() { res }: MyContext
  ): Promise<userResponse> {
    // let errors = validateLogin(inputs);

    let user = await conn.manager.findOneBy(
      User,
      inputs.usernameOrEmail.includes("@")
        ? { email: inputs.usernameOrEmail }
        : { username: inputs.usernameOrEmail }
    );

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            error: "Usert not found!",
          },
        ],
      };
    }
    const token = await jwt.sign(
      { userId: user.id },
      <string>process.env.HASH_JWT,
      {
        expiresIn: "14d",
      }
    );

    if (await bcrypt.compare(inputs.password, user.password)) {
      res.cookie("uid", token, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    } else {
      return {
        errors: [{ field: "password", error: "Passwords do not match" }],
      };
    }
    user.token = token;
    return { user };
  }
}
