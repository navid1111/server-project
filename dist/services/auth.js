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
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRE) {
            throw new Error('JWT configuration is missing');
        }
        this.JWT_SECRET = process.env.JWT_SECRET;
    }
    generateToken(user) {
        const signOptions = {
            expiresIn: '30d',
        };
        return jsonwebtoken_1.default.sign({
            id: user._id,
            provider: user.provider,
        }, this.JWT_SECRET, signOptions);
    }
    matchPassword(enteredPassword, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.password) {
                throw new Error('User has no password set (OAuth user)');
            }
            return yield bcryptjs_1.default.compare(enteredPassword, user.password);
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcryptjs_1.default.genSalt(10);
            return yield bcryptjs_1.default.hash(password, salt);
        });
    }
}
exports.authService = new AuthService();
exports.default = exports.authService;
