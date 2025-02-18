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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    githubId: {
        type: String,
        sparse: true,
        index: true,
    },
    displayName: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
    },
    profileUrl: {
        type: String,
    },
    photos: [
        {
            value: String,
        },
    ],
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        select: false, // Don't include password by default in queries
    },
    provider: {
        type: String,
        required: true,
        enum: ['local', 'github'],
        default: 'local',
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
// Hash password before saving
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only hash the password if it has been modified (or is new)
        if (!this.isModified('password'))
            return next();
        try {
            // Generate salt and hash password
            const salt = yield bcryptjs_1.default.genSalt(10);
            if (this.password) {
                this.password = yield bcryptjs_1.default.hash(this.password, salt);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
