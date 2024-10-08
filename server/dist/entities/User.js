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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Argument_1 = require("./Argument");
const Post_1 = require("./Post");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    (0, typeorm_1.Column)("text", { array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "topicsFollowed", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post]),
    (0, typeorm_1.OneToMany)(() => Post_1.Post, (post) => post.user),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Argument_1.Argument]),
    (0, typeorm_1.OneToMany)(() => Argument_1.Argument, (argument) => argument.user),
    __metadata("design:type", Array)
], User.prototype, "arguments", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    (0, typeorm_1.Column)("int", { array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "likes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    (0, typeorm_1.Column)("int", { array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "dislikes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    (0, typeorm_1.Column)("int", { array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "argLikes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    (0, typeorm_1.Column)("int", { array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "argDislikes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "date_created", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "last_modified", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map