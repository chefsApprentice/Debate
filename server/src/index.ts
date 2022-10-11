import path from "path";
import { buildSchema } from "type-graphql";
import "../.env";
// import { DataSource } from "typeorm";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const main = async () => {
  console.log("pass", process.env.PG_PASSWORD);
  const conn = await createConnection({
    type: "postgres",
    host: "localhost",
    database: "debate",
    url: process.env.DATABASE_URL,
    logging: process.env.NODE_ENV !== "production",
    username: <string>process.env.PG_USERNAME!,
    password: <string>process.env.PG_PASSWORD!,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/.{js,ts}*")],
    entities: [path.join(__dirname, "./entities/.{js,ts}*")],
  });

  // conn.initialize().then(() => console.log("conn initiitex"));
  // console.log("buh");

  await conn.runMigrations();

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

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
