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
exports.UserResolver = exports.registerInput = exports.loginInput = void 0;
const User_1 = require("../entities/User");
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
const validateRegister_1 = require("../utils/validateRegister");
require("../../.env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../index");
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
class UserResolver {
    hello() {
        console.log("nani");
        return "bye";
    }
    register(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("decorum");
            let errors = (0, validateRegister_1.validateRegister)(inputs);
            console.log("errors:", errors);
            if (errors.length != 0) {
                return { errors };
            }
            console.log("we must be hanigng");
            let user = yield User_1.User.findOne({ where: { username: inputs.username } });
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
            user = yield User_1.User.findOne({ where: { email: inputs.email } });
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
            console.log(1);
            const hashedPassword = yield bcrypt_1.default.hash(inputs.password, 10);
            console.log(2);
            const token = yield jsonwebtoken_1.default.sign({ username: inputs.username }, process.env.HASH_JWT, {
                expiresIn: "14d",
            });
            console.log(3);
            const newUser = new User_1.User();
            newUser.email = inputs.email;
            newUser.username = inputs.username;
            newUser.password = hashedPassword;
            newUser.token = token;
            yield index_1.conn.manager.save(newUser);
            console.log(4);
            console.log("wtf");
            console.log("newUser id", newUser.id);
            return { user: user };
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
    (0, type_graphql_1.Mutation)(() => userResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registerInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map