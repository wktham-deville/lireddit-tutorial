"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (!options.email.includes('@')) {
        return [
            {
                field: "email",
                message: "invalid email",
            },
        ];
    }
    if (options.username.length <= 4) {
        return [
            {
                field: "username",
                message: "length must be greater than 4",
            },
        ];
    }
    if (options.username.includes('@')) {
        return [
            {
                field: "username",
                message: "invalid username",
            },
        ];
    }
    if (options.password.length <= 4) {
        return [
            {
                field: "password",
                message: "length must be greater than 4",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map