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
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./entities/User");
dotenv_1.default.config();
const port = process.env.PORT;
const conn = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    database: "debate",
    schema: "debateSchema",
    logging: true,
    username: process.env.PG_USERNAME,
    password: "123456Dog!",
    synchronize: true,
    migrations: [path_1.default.join(__dirname, "./migrations/.{js,ts}*")],
    entities: [User_1.User],
});
exports.conn = conn;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield conn.initialize().then(() => console.log("conn init"));
    yield conn.runMigrations();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver],
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
        cors: true,
    });
    app.listen(parseInt(port), () => {
        console.log("server started on localhost:4000");
    });
});
main();
//# sourceMappingURL=index.js.map