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
let postsInput = class postsInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], postsInput.prototype, "topic", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], postsInput.prototype, "scrolledDown", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], postsInput.prototype, "sortBy", void 0);
postsInput = __decorate([
    (0, type_graphql_1.Resolver)(Post_1.Post),
    (0, type_graphql_1.InputType)()
], postsInput);
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
            let posts = yield index_1.conn.manager.find(Post_1.Post);
            return posts;
        });
    }
    paginatedPosts(inputs, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectionAmount = 25;
            let skip = (inputs.scrolledDown - 1) * selectionAmount;
            let [posts, total] = yield index_1.conn.manager.findAndCount(Post_1.Post, {
                skip,
                take: selectionAmount,
            });
            console.log("psots", posts, total);
            return {
                errors: [
                    { field: "No error", error: "check console . log please baebs" },
                ],
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
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map