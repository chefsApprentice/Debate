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
exports.boolError = exports.rateInput = exports.OperationFieldResponse = exports.FieldError = void 0;
const type_graphql_1 = require("type-graphql");
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "error", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
exports.FieldError = FieldError;
let OperationFieldResponse = class OperationFieldResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], OperationFieldResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], OperationFieldResponse.prototype, "operation", void 0);
OperationFieldResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], OperationFieldResponse);
exports.OperationFieldResponse = OperationFieldResponse;
let rateInput = class rateInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], rateInput.prototype, "targetId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], rateInput.prototype, "direction", void 0);
rateInput = __decorate([
    (0, type_graphql_1.InputType)()
], rateInput);
exports.rateInput = rateInput;
let boolError = class boolError {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], boolError.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], boolError.prototype, "success", void 0);
boolError = __decorate([
    (0, type_graphql_1.ObjectType)()
], boolError);
exports.boolError = boolError;
//# sourceMappingURL=types.js.map