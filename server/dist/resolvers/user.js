"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = exports.userResponse = exports.registerInput = exports.loginInput = void 0;
const User_1 = require("../entities/User");
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
const validateRegistration_1 = require("../utils/validateRegistration");
require("../../.env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../index");
const verifyUser_1 = require("../utils/verifyUser");
let loginInput = class loginInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], loginInput.prototype, "usernameOrEmail", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], loginInput.prototype, "password", void 0);
loginInput = __decorate([
    (0, type_graphql_1.Resolver)(User_1.User),
    (0, type_graphql_1.InputType)()
], loginInput);
exports.loginInput = loginInput;
let registerInput = class registerInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], registerInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], registerInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], registerInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], registerInput.prototype, "confirmPassword", void 0);
registerInput = __decorate([
    (0, type_graphql_1.InputType)()
], registerInput);
exports.registerInput = registerInput;
let userResponse = class userResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], userResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], userResponse.prototype, "user", void 0);
userResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], userResponse);
exports.userResponse = userResponse;
let logoutResponse = class logoutResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => types_1.FieldError, { nullable: true }),
    __metadata("design:type", types_1.FieldError)
], logoutResponse.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], logoutResponse.prototype, "success", void 0);
logoutResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], logoutResponse);
class UserResolver {
    hello() {
        return "bye";
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield index_1.conn.manager.find(User_1.User);
            return users;
        });
    }
    register(inputs, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            let errors = (0, validateRegistration_1.validateRegistration)(inputs);
            if (errors.length != 0) {
                return { errors };
            }
            let user = yield index_1.conn.manager.findOneBy(User_1.User, {
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
            user = yield index_1.conn.manager.findOneBy(User_1.User, {
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
            const hashedPassword = yield bcrypt_1.default.hash(inputs.password, 10);
            const token = yield jsonwebtoken_1.default.sign({ username: inputs.username }, process.env.HASH_JWT, {
                expiresIn: "14d",
            });
            res.cookie("uid", token, {
                maxAge: 14 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            const newUser = new User_1.User();
            newUser.email = inputs.email;
            newUser.username = inputs.username;
            newUser.password = hashedPassword;
            yield index_1.conn.manager.save(newUser);
            return { user: newUser };
        });
    }
    login(inputs, { res, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers["authorization"]) {
                return {
                    errors: [{ field: "token", error: "You are already logged in" }],
                };
            }
            let user = yield index_1.conn.manager.findOneBy(User_1.User, inputs.usernameOrEmail.includes("@")
                ? { email: inputs.usernameOrEmail }
                : { username: inputs.usernameOrEmail });
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
            const token = yield jsonwebtoken_1.default.sign({ userId: user.id }, process.env.HASH_JWT, {
                expiresIn: "14d",
            });
            if (yield bcrypt_1.default.compare(inputs.password, user.password)) {
                res.cookie("uid", token, {
                    maxAge: 14 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
            }
            else {
                return {
                    errors: [{ field: "password", error: "Passwords do not match" }],
                };
            }
            return { user };
        });
    }
    autoLogin({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.headers["authorization"];
            return yield (0, verifyUser_1.verifyUser)(token);
        });
    }
    logout({ res }) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("uid");
            return { success: true };
        });
    }
}
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => userResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registerInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => userResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => userResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "autoLogin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => logoutResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map