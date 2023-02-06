import path from "path";
import { buildSchema } from "type-graphql";
import "../.env";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { DataSource } from "typeorm";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { Argument } from "./entities/Argument";
dotenv.config();

const port = process.env.PORT;

// const main = async () => {
const conn = new DataSource({
  type: "postgres",
  host: "localhost",
  database: "debate",
  // url: "debate",
  schema: "debateSchema",
  // url: "localhost:5432",
  logging: true,
  username: <string>process.env.PG_USERNAME!,
  password: "123456Dog!",
  synchronize: true,
  migrations: [path.join(__dirname, "./migrations/.{js,ts}*")],
  // entities: [path.join(__dirname, "./entities/.{js,ts}*")],
  entities: [User, Post, Argument],
});
export { conn };

const main = async () => {
  await conn.initialize().then(() => console.log("conn init"));
  // console.log("buh");

  await conn.runMigrations();

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(cookieParser());

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: true,
    }),
    context: ({ req, res }: MyContext) => ({
      req,
      res,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: true,
  });

  app.listen(parseInt(port!), () => {
    console.log("server started on localhost:4000");
  });
};

main();

// app.get("/", (__: any, res: any) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

//{
//     type: "postgres",
//     url: process.env.DATABASE_URL,
//     logging: true,
//     // synchronize: true,
//     migrations: [path.join(__dirname, "./migrations/*")],
//     entities: [],
//   }
