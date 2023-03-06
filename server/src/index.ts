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
import { PostResolver } from "./resolvers/post";
import { ArgumentResolver } from "./resolvers/argument";
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
  logging: false,
  username: <string>process.env.PG_USERNAME!,
  password: "123456Dog!",
  synchronize: false,
  migrations: [path.join(__dirname, "./migrations/.{js,ts}*")],
  // entities: [path.join(__dirname, "./entities/.{js,ts}*")],
  entities: [User, Post, Argument],
});
export { conn };

const main = async () => {
  await conn.initialize().then(() => console.log("conn init"));
  await conn.runMigrations();

  const app = express();
  // app.options("*", cors());
  // app.use(
  //   cors({
  //     credentials: true,
  //   })
  // );

  var whitelist = ["https://studio.apollographql.com", "http://localhost:3000"];
  var corsOptions = {
    origin: function (origin: any, callback: any) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(cookieParser());

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, ArgumentResolver],
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
    cors: corsOptions,
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
