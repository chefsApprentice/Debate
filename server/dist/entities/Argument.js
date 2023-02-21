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
exports.Argument = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Post_1 = require("./Post");
const User_1 = require("./User");
let Argument = class Argument extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Argument.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.posts),
    __metadata("design:type", User_1.User)
], Argument.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Post_1.Post),
    (0, typeorm_1.ManyToOne)(() => Post_1.Post, (post) => post.arguments),
    __metadata("design:type", Post_1.Post)
], Argument.prototype, "post", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Argument.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Argument.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Argument.prototype, "ranking", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Argument.prototype, "points", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number]),
    (0, typeorm_1.Column)("int", { array: true }),
    __metadata("design:type", Array)
], Argument.prototype, "referencedBy", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number]),
    (0, typeorm_1.Column)("int", { array: true }),
    __metadata("design:type", Array)
], Argument.prototype, "references", void 0);
Argument = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Argument);
exports.Argument = Argument;
//# sourceMappingURL=Argument.js.map