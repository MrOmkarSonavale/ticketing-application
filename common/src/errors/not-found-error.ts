import { CustomError } from "./custom-error.js";

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super('Router not found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    };

    serializeErrors() {
        return [{ message: "not found" }];
    }

};