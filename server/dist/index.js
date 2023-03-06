"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conn = void 0;
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
require("../.env");
const user_1 = require("./resolvers/user");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./entities/User");
const Post_1 = require("./entities/Post");
const Argument_1 = require("./entities/Argument");
const post_1 = require("./resolvers/post");
const argument_1 = require("./resolvers/argument");
dotenv_1.default.config();
const port = process.env.PORT;
const conn = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    database: "debate",
    schema: "debateSchema",
    logging: false,
    username: process.env.PG_USERNAME,
    password: "123456Dog!",
    synchronize: false,
    migrations: [path_1.default.join(__dirname, "./migrations/.{js,ts}*")],
    entities: [User_1.User, Post_1.Post, Argument_1.Argument],
});
exports.conn = conn;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield conn.initialize().then(() => console.log("conn init"));
    yield conn.runMigrations();
    const app = (0, express_1.default)();
    var whitelist = ["https://studio.apollographql.com", "http://localhost:3000"];
    var corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));
    app.use((0, cookie_parser_1.default)());
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver, post_1.PostResolver, argument_1.ArgumentResolver],
            validate: true,
        }),
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: corsOptions,
    });
    app.listen(parseInt(port), () => {
        console.log("server started on localhost:4000");
    });
});
main();
//# sourceMappingURL=index.js.map