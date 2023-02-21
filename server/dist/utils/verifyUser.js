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
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const index_1 = require("../index");
const verifyUser = (authHeader) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authHeader) {
        return { errors: [{ field: "user", error: "User not logged in" }] };
    }
    try {
        let userId = (jsonwebtoken_1.default.verify(authHeader, process.env.HASH_JWT));
        let user = yield index_1.conn.manager.findOneBy(User_1.User, {
            id: userId.userId,
        });
        if (!user) {
            return { errors: [{ field: "token", error: "No user" }] };
        }
        return { user };
    }
    catch (_a) {
        return { errors: [{ field: "token", error: "Token is invalid" }] };
    }
});
exports.verifyUser = verifyUser;
//# sourceMappingURL=verifyUser.js.map