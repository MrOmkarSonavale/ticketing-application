import { CustomError } from "./custom-error.js";

export class BadRequestError extends CustomError {
    BadErrormessage: string;
    statusCode = 400;
    constructor(public message: string) {
        super(message);

        this.BadErrormessage = message;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    };

    serializeErrors() {
        return [{
            message: this.BadErrormessage
        }]
    }
};