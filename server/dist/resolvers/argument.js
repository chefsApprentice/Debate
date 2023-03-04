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
exports.ArgumentResolver = void 0;
const Argument_1 = require("../entities/Argument");
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const types_1 = require("../types");
const __1 = require("..");
const User_1 = require("../entities/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyUser_1 = require("../utils/verifyUser");
let createArgumentInput = class createArgumentInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], createArgumentInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], createArgumentInput.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], createArgumentInput.prototype, "points", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number]),
    __metadata("design:type", Array)
], createArgumentInput.prototype, "references", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], createArgumentInput.prototype, "postId", void 0);
createArgumentInput = __decorate([
    (0, type_graphql_1.Resolver)(Argument_1.Argument),
    (0, type_graphql_1.InputType)()
], createArgumentInput);
let argumentIdClass = class argumentIdClass {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], argumentIdClass.prototype, "argId", void 0);
argumentIdClass = __decorate([
    (0, type_graphql_1.InputType)()
], argumentIdClass);
let anArgumentResponse = class anArgumentResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], anArgumentResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Argument_1.Argument, { nullable: true }),
    __metadata("design:type", Argument_1.Argument)
], anArgumentResponse.prototype, "argument", void 0);
anArgumentResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], anArgumentResponse);
class argumentsResponse {
}
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], argumentsResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Argument_1.Argument], { nullable: true }),
    __metadata("design:type", Array)
], argumentsResponse.prototype, "arguments", void 0);
class ArgumentResolver {
    fetchArgument(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const argRepo = __1.conn.getRepository(Argument_1.Argument);
            const argument = yield argRepo.findOne({
                where: { id: inputs.argId },
                relations: {
                    user: true,
                    post: { user: true },
                },
            });
            console.log("argumentsssssssssssssssssssssssssssss", argument);
            if (!argument) {
                return {
                    errors: [{ field: "argId", error: "That argument doesn't exist" }],
                };
            }
            return { argument };
        });
    }
    createArgument(inputs, { req }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let userOrError = yield (0, verifyUser_1.verifyUser)(req.headers["authorization"]);
            if (userOrError.errors) {
                return { errors: userOrError.errors };
            }
            switch (inputs.type) {
                case "for":
                    break;
                case "against":
                    break;
                case "rejoinder":
                    break;
                default:
                    return {
                        errors: [{ field: "type", error: "Not one of the accepted types" }],
                    };
            }
            let userId = (yield jsonwebtoken_1.default.verify(req.headers["authorization"], process.env.HASH_JWT));
            let userRepo = yield __1.conn.getRepository(User_1.User);
            let user = yield userRepo.findOne({
                where: { id: userId.userId },
                relations: { arguments: true },
            });
            let postRepo = yield __1.conn.getRepository(Post_1.Post);
            let post = yield postRepo.findOne({
                where: { id: inputs.postId },
                relations: { arguments: true },
            });
            if (!post) {
                return {
                    errors: [{ field: "postId", error: "That post doesn't exist" }],
                };
            }
            let newArgument = {
                title: inputs.title,
                type: inputs.type,
                points: inputs.points,
                ranking: 0,
                references: inputs.references,
                referencedBy: [],
                user: user,
                post: post,
            };
            let argumentRepo = yield __1.conn.getRepository(Argument_1.Argument);
            let argument = yield argumentRepo.save(argumentRepo.create(newArgument));
            (_a = user.arguments) === null || _a === void 0 ? void 0 : _a.push(argument);
            yield userRepo.save(user);
            (_b = post.arguments) === null || _b === void 0 ? void 0 : _b.push(argument);
            yield postRepo.save(post);
            let referenceError = [];
            for (let i = 0; i != inputs.references.length; i++) {
                let referencedArg = yield argumentRepo.findOne({
                    where: { id: inputs.references[i] },
                });
                if (!referencedArg) {
                    console.log("hit");
                    let errorString = "argument of id: " +
                        inputs.references[i] +
                        " doesn't exist.";
                    referenceError.push({
                        field: "references",
                        error: errorString,
                    });
                    continue;
                }
                referencedArg.referencedBy.push(argument.id);
                argumentRepo.save(referencedArg);
            }
            if (referenceError.length >= 1) {
                return {
                    argument: argument,
                    errors: referenceError,
                };
            }
            return { argument: argument };
        });
    }
    rateArgument(inputs, { req }) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            let userOrError = yield (0, verifyUser_1.verifyUser)(req.headers["authorization"]);
            if (userOrError.errors) {
                return { errors: userOrError.errors };
            }
            let user = userOrError.user;
            let argument = yield __1.conn.manager.findOne(Argument_1.Argument, {
                where: { id: inputs.targetId },
            });
            if (!argument) {
                return {
                    errors: [{ field: "targetId", error: "Argument doesn't exist" }],
                };
            }
            let dir = 0;
            if (inputs.direction == "up") {
                dir = 1;
                let likesId = (_a = user.argLikes) === null || _a === void 0 ? void 0 : _a.indexOf(inputs.targetId);
                if (likesId > -1) {
                    argument.ranking -= 1;
                    user === null || user === void 0 ? void 0 : user.argLikes.splice(likesId);
                    yield __1.conn.manager.save(User_1.User, user);
                    yield __1.conn.manager.save(Argument_1.Argument, argument);
                    return { argument };
                }
                let dislikesId = (_b = user.argDislikes) === null || _b === void 0 ? void 0 : _b.indexOf(inputs.targetId);
                if (dislikesId > -1) {
                    argument.ranking += 2;
                    user === null || user === void 0 ? void 0 : user.argDislikes.splice(likesId);
                    (_c = user === null || user === void 0 ? void 0 : user.argLikes) === null || _c === void 0 ? void 0 : _c.push(inputs.targetId);
                    yield __1.conn.manager.save(User_1.User, user);
                    yield __1.conn.manager.save(Argument_1.Argument, argument);
                    return { argument };
                }
                argument.ranking += dir;
                (_d = user === null || user === void 0 ? void 0 : user.argLikes) === null || _d === void 0 ? void 0 : _d.push(inputs.targetId);
                yield __1.conn.manager.save(User_1.User, user);
                yield __1.conn.manager.save(Argument_1.Argument, argument);
                return { argument };
            }
            else if (inputs.direction == "down") {
                dir = -1;
                let likesId = (_e = user.argLikes) === null || _e === void 0 ? void 0 : _e.indexOf(inputs.targetId);
                if (likesId > -1) {
                    argument.ranking -= 2;
                    user === null || user === void 0 ? void 0 : user.argLikes.splice(likesId);
                    (_f = user === null || user === void 0 ? void 0 : user.argDislikes) === null || _f === void 0 ? void 0 : _f.push(inputs.targetId);
                    yield __1.conn.manager.save(User_1.User, user);
                    yield __1.conn.manager.save(Argument_1.Argument, argument);
                    return { argument };
                }
                let dislikesId = (_g = user.argDislikes) === null || _g === void 0 ? void 0 : _g.indexOf(inputs.targetId);
                if (dislikesId > -1) {
                    argument.ranking += 1;
                    user === null || user === void 0 ? void 0 : user.argDislikes.splice(likesId);
                    yield __1.conn.manager.save(User_1.User, user);
                    yield __1.conn.manager.save(Argument_1.Argument, argument);
                    return { argument };
                }
                argument.ranking += dir;
                (_h = user === null || user === void 0 ? void 0 : user.argDislikes) === null || _h === void 0 ? void 0 : _h.push(inputs.targetId);
                yield __1.conn.manager.save(User_1.User, user);
                yield __1.conn.manager.save(Argument_1.Argument, argument);
                return { argument };
            }
            else {
                return {
                    errors: [{ field: "direction", error: "Invalid direction" }],
                };
            }
        });
    }
    deleteArgument(argId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let userOrError = yield (0, verifyUser_1.verifyUser)(req.headers["authorization"]);
            if (userOrError.errors) {
                return { errors: userOrError.errors };
            }
            else if (!userOrError.user) {
                return { errors: [{ field: "user", error: "No user!" }] };
            }
            let user = userOrError.user;
            let argRepo = yield __1.conn.getRepository(Argument_1.Argument);
            try {
                let success = yield argRepo.delete({
                    id: argId.argId,
                    user: { id: user.id },
                });
                if (success.affected == 1) {
                    return { success: true };
                }
                else if (success.affected == 0) {
                    return { success: false };
                }
            }
            catch (e) {
                return { errors: [{ error: e, field: "Proabably_user" }] };
            }
            return { success: false };
        });
    }
}
__decorate([
    (0, type_graphql_1.Query)(() => anArgumentResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [argumentIdClass]),
    __metadata("design:returntype", Promise)
], ArgumentResolver.prototype, "fetchArgument", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => anArgumentResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createArgumentInput, Object]),
    __metadata("design:returntype", Promise)
], ArgumentResolver.prototype, "createArgument", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => anArgumentResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.rateInput, Object]),
    __metadata("design:returntype", Promise)
], ArgumentResolver.prototype, "rateArgument", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.boolError),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [argumentIdClass, Object]),
    __metadata("design:returntype", Promise)
], ArgumentResolver.prototype, "deleteArgument", null);
exports.ArgumentResolver = ArgumentResolver;
//# sourceMappingURL=argument.js.map