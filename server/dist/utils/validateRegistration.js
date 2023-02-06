"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistration = void 0;
let validateRegistration = (inputs) => {
    let errors = [];
    if (inputs.username.trim().length < 8) {
        errors.push({
            field: "username",
            error: "length must be greater than 8",
        });
    }
    if (inputs.username.trim().length > 32) {
        errors.push({
            field: "username",
            error: "length must be shorter than 32",
        });
    }
    if (!inputs.email.includes("@")) {
        errors.push({
            field: "email",
            error: "Must be a valid email",
        });
    }
    if (inputs.username.includes("@")) {
        errors.push({
            field: "username",
            error: "Username cannot include an @",
        });
    }
    if (inputs.password.length < 8) {
        errors.push({
            field: "password",
            error: "length must be greater than 8",
        });
    }
    if (inputs.password.length > 32) {
        errors.push({
            field: "password",
            error: "length must be short than 32",
        });
    }
    if (inputs.password.trim() != inputs.confirmPassword.trim()) {
        errors.push({
            field: "confirm_password",
            error: "The passwords do not match",
        });
    }
    return errors;
};
exports.validateRegistration = validateRegistration;
//# sourceMappingURL=validateRegistration.js.map