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

@InputType()
class userIdClass {
  @Field()
  userId: number;
}

@ObjectType()
export class userResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
  @Field({ nullable: true })
  token?: string;
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

  @Query(() => userResponse)
  async fetchUser(@Arg("inputs") userId: userIdClass) {
    const userRepo = conn.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId.userId },
      relations: {
        posts: true,
        arguments: true,
      },
    });
    if (!user) {
      return {
        errors: [{ field: "userId", error: "That user doesn't exist" }],
      };
    }
    return { user };
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

    const newUser = new User();
    newUser.email = inputs.email;
    newUser.username = inputs.username;
    newUser.password = hashedPassword;
    newUser.topicsFollowed = [];
    newUser.argLikes = [];
    newUser.argDislikes = [];
    newUser.likes = [];
    newUser.dislikes = [];

    let userMade = await conn.manager.save(newUser);
    // Token so that when the user stays logged in after elaving webpage
    // Uses environment varibale for hash for secuity
    const token = await jwt.sign(
      { userId: userMade.id },
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
    return { user: newUser!, token: token };
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
    return { user, token };
  }

  @Mutation(() => userResponse)
  async addTopic(
    @Arg("topic") topic: string,
    @Ctx() { req }: MyContext
  ): Promise<userResponse> {
    let userOrError = await verifyUser(req.headers["authorization"]!);
    if (typeof userOrError.errors == undefined) {
      return { errors: userOrError.errors };
    }

    let userId: JwtPayload = <JwtPayload>(
      await jwt.verify(req.headers["authorization"]!, process.env.HASH_JWT!)
    );
    let userRepo = await conn.getRepository(User);
    let user = await userRepo.findOne({
      where: { id: <number>(<unknown>userId.userId) },
    });
    try {
      let x = user!.topicsFollowed?.indexOf(topic);
      if (x! >= 0) {
        return {
          errors: [{ error: "Topic already followed", field: "topic" }],
        };
      }
      user!.topicsFollowed!.push(topic);
    } catch {
      user!.topicsFollowed! = [topic];
    }

    await userRepo.save(user!);

    return { user: <User>user };
  }

  @Query(() => userResponse)
  async autoLogin(@Ctx() { req }: MyContext): Promise<userResponse> {
    let token = req.headers["authorization"];
    return await verifyUser(token!);
  }

  @Mutation(() => logoutResponse)
  async logout(@Ctx() { res }: MyContext): Promise<logoutResponse> {
    res.clearCookie("token");
    return { success: true };
  }
}
