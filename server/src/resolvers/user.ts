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
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { conn } from "../index";
import { verifyUser } from "../utils/verifyUser";

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
export class userResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class logoutResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
  @Field(() => Boolean)
  success!: Boolean;
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

    // Verifying user and email are unique
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

    // Use imported library to hash password with 10 salts, need password to be secure
    const hashedPassword = await bcrypt.hash(inputs.password, 10);

    // Token so that when the user stays logged in after elaving webpage
    // Uses environment varibale for hash for secuity
    const token = await jwt.sign(
      { username: inputs.username },
      <string>process.env.HASH_JWT,
      {
        expiresIn: "14d",
      }
    );
    // Client's browser cookie is set to the hashed token containing their user id.
    // Some of these settings are needed for testing in Apollo sandbox
    res.cookie("uid", token, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const newUser = new User();
    newUser.email = inputs.email;
    newUser.username = inputs.username;
    newUser.password = hashedPassword;
    newUser.argLikes = [];
    newUser.argDislikes = [];
    newUser.likes = [];
    newUser.dislikes = [];

    await conn.manager.save(newUser);
    return { user: newUser! };
  }

  @Mutation(() => userResponse)
  async login(
    @Arg("inputs") inputs: loginInput,
    @Ctx() { res, req }: MyContext
  ): Promise<userResponse> {
    if (req.headers["authorization"]) {
      return {
        errors: [{ field: "token", error: "You are already logged in" }],
      };
    }
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
            error: "User not found!",
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
        secure: true,
        sameSite: "none",
      });
    } else {
      return {
        errors: [{ field: "password", error: "Passwords do not match" }],
      };
    }
    return { user };
  }

  @Query(() => userResponse)
  async autoLogin(@Ctx() { req }: MyContext): Promise<userResponse> {
    let token = req.headers["authorization"];
    return await verifyUser(token!);
  }

  @Mutation(() => logoutResponse)
  async logout(@Ctx() { res }: MyContext): Promise<logoutResponse> {
    res.clearCookie("uid");
    return { success: true };
  }
}
