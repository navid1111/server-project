"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const erroResponse_1 = __importDefault(require("../utils/erroResponse"));
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    console.log(err.name);
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found `;
        error = new erroResponse_1.default(message, 404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new erroResponse_1.default(message, 400);
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(error.errors || {}).map(val => val.message);
        const message = messages.join(', ');
        error = new erroResponse_1.default(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};
exports.default = errorHandler;
