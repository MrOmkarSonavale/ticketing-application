import type { ValidationError } from "express-validator";
import { CustomError } from "./custom-error.js";

export class RequestValidationError extends CustomError {
    // private error: ValidationError[] = [];
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super("validation error");

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    };

    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.type }
        })
    };
};

// throw new RequestValidationError(errors);