"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Maintain proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorResponse);
        }
        // Needed for instanceof checks to work properly with ES6 classes
        Object.setPrototypeOf(this, ErrorResponse.prototype);
    }
}
exports.default = ErrorResponse;
