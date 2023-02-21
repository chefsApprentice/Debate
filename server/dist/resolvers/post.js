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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const index_1 = require("../index");
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const types_1 = require("../types");
const verifyUser_1 = require("../utils/verifyUser");
const User_1 = require("../entities/User");
const paginated_Utils_1 = require("../utils/paginated Utils");
let postsInput = class postsInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], postsInput.prototype, "topics", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], postsInput.prototype, "scrolledDown", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], postsInput.prototype, "sortBy", void 0);
postsInput = __decorate([
    (0, type_graphql_1.Resolver)(Post_1.Post),
    (0, type_graphql_1.InputType)()
], postsInput);
let rateInput = class rateInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], rateInput.prototype, "postId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], rateInput.prototype, "direction", void 0);
rateInput = __decorate([
    (0, type_graphql_1.InputType)()
], rateInput);
let createPostInput = class createPostInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], createPostInput.prototype, "topic", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], createPostInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], createPostInput.prototype, "description", void 0);
createPostInput = __decorate([
    (0, type_graphql_1.InputType)()
], createPostInput);
let postsResponse = class postsResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], postsResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post], { nullable: true }),
    __metadata("design:type", Array)
], postsResponse.prototype, "posts", void 0);
postsResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], postsResponse);
let aPostResponse = class aPostResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], aPostResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Post_1.Post, { nullable: true }),
    __metadata("design:type", Post_1.Post)
], aPostResponse.prototype, "post", void 0);
aPostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], aPostResponse);
class PostResolver {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepo = index_1.conn.getRepository(Post_1.Post);
            const posts = yield postRepo.find({
                relations: {
                    user: true,
                },
            });
            return posts;
        });
    }
    paginatedPosts(inputs, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            let order = (0, paginated_Utils_1.orderSwitch)(inputs.sortBy[0], inputs.sortBy[1]);
            if (order === null || order === void 0 ? void 0 : order.error) {
                return { errors: [order] };
            }
            const selectionAmount = 3;
            let skip = inputs.scrolledDown * selectionAmount;
            const postRepo = index_1.conn.getRepository(Post_1.Post);
            let repoVar = {
                skip,
                take: selectionAmount,
                order: order,
                relations: {
                    user: true,
                },
            };
            typeof inputs.topics !== undefined &&
                (repoVar.where = (0, paginated_Utils_1.outputTopics)(inputs.topics));
            const [posts, __] = yield postRepo.findAndCount(repoVar);
            return {
                posts: posts,
            };
        });
    }
    createPost(inputs, { req }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield (0, verifyUser_1.verifyUser)(req.headers["authorization"]);
            if (typeof user.errors == undefined) {
                return { errors: user.errors };
            }
            let newPost = new Post_1.Post();
            newPost.title = inputs.title;
            newPost.description = inputs.description;
            newPost.topic = inputs.topic;
            newPost.ranking = 0;
            newPost.user = user.user;
            let post = yield index_1.conn.manager.save(Post_1.Post, newPost);
            (_b = (_a = user.user) === null || _a === void 0 ? void 0 : _a.posts) === null || _b === void 0 ? void 0 : _b.push(post);
            yield index_1.conn.manager.save(User_1.User, user.user);
            return { post: newPost };
        });
    }
    ratePost(inputs, { req }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.headers["authorization"]) {
                return {
                    errors: [{ field: "user", error: "User not logged in" }],
                };
            }
            let user = yield (0, verifyUser_1.verifyUser)(req.headers["authorization"]);
            if (typeof user.errors == undefined) {
                return { errors: user.errors };
            }
            let post = yield index_1.conn.manager.findOne(Post_1.Post, {
                where: { id: inputs.postId },
            });
            if (!post) {
                return {
                    errors: [{ field: "post_id", error: "Post doesn't exist" }],
                };
            }
            let dir = 0;
            if (inputs.direction == "up") {
                dir = 1;
                let likesId = (_a = user.user.likes) === null || _a === void 0 ? void 0 : _a.indexOf(inputs.postId);
                if (likesId > -1) {
                    dir = -1;
                    console.log("1  ");
                    post.ranking += dir;
                    (_b = user.user) === null || _b === void 0 ? void 0 : _b.likes.splice(likesId);
                    yield index_1.conn.manager.save(Post_1.Post, post);
                    yield index_1.conn.manager.save(User_1.User, user.user);
                    return {
                        operation: "unliked",
                    };
                }
                let dislikesId = (_d = (_c = user.user) === null || _c === void 0 ? void 0 : _c.dislikes) === null || _d === void 0 ? void 0 : _d.indexOf(inputs.postId);
                if (dislikesId > -1) {
                    dir = +2;
                    post.ranking += dir;
                    (_e = user.user) === null || _e === void 0 ? void 0 : _e.dislikes.splice(dislikesId);
                    yield index_1.conn.manager.save(Post_1.Post, post);
                    yield index_1.conn.manager.save(User_1.User, user.user);
                    return {
                        operation: "liked",
                    };
                }
                post.ranking += dir;
                try {
                    (_f = user.user) === null || _f === void 0 ? void 0 : _f.likes.push(inputs.postId);
                }
                catch (_o) {
                    user.user.likes = [inputs.postId];
                }
                yield index_1.conn.manager.save(Post_1.Post, post);
                yield index_1.conn.manager.save(User_1.User, user.user);
                return {
                    operation: "liked",
                };
            }
            else if (inputs.direction == "down") {
                dir = -1;
                let dislikesId = (_h = (_g = user.user) === null || _g === void 0 ? void 0 : _g.dislikes) === null || _h === void 0 ? void 0 : _h.indexOf(inputs.postId);
                if (dislikesId > -1) {
                    dir = +1;
                    post.ranking += dir;
                    (_j = user.user) === null || _j === void 0 ? void 0 : _j.dislikes.splice(dislikesId);
                    yield index_1.conn.manager.save(Post_1.Post, post);
                    yield index_1.conn.manager.save(User_1.User, user.user);
                    return {
                        operation: "undisliked",
                    };
                }
                let likesId = (_k = user.user.likes) === null || _k === void 0 ? void 0 : _k.indexOf(inputs.postId);
                if (likesId > -1) {
                    dir = -2;
                    post.ranking += dir;
                    (_l = user.user) === null || _l === void 0 ? void 0 : _l.likes.splice(likesId);
                    yield index_1.conn.manager.save(Post_1.Post, post);
                    yield index_1.conn.manager.save(User_1.User, user.user);
                    return {
                        operation: "dislked",
                    };
                }
                post.ranking += dir;
                try {
                    (_m = user.user) === null || _m === void 0 ? void 0 : _m.dislikes.push(inputs.postId);
                }
                catch (_p) {
                    user.user.dislikes = [inputs.postId];
                }
                yield index_1.conn.manager.save(Post_1.Post, post);
                yield index_1.conn.manager.save(User_1.User, user.user);
                return {
                    operation: "disliked",
                };
            }
            return {
                errors: [{ field: "direction", error: "Invalid direction" }],
            };
        });
    }
}
__decorate([
    (0, type_graphql_1.Query)(() => [Post_1.Post]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPosts", null);
__decorate([
    (0, type_graphql_1.Query)(() => postsResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [postsInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "paginatedPosts", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => aPostResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createPostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.OperationFieldResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rateInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "ratePost", null);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map