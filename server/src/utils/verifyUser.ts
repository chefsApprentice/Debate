import jwt, { JwtPayload } from "jsonwebtoken";
import { userResponse } from "../resolvers/user";
import { User } from "../entities/User";
import { conn } from "../index";

export const verifyUser = async (authHeader: string): Promise<userResponse> => {
  try {
    let userId: JwtPayload = <JwtPayload>(
      jwt.verify(authHeader!, process.env.HASH_JWT!)
    );
    let user = await conn.manager.findOneBy(User, {
      id: userId.userId!,
    });
    if (!user) {
      return { errors: [{ field: "token", error: "No user" }] };
    }
    return { user };
  } catch {
    return { errors: [{ field: "token", error: "Token is invalid" }] };
  }
};
