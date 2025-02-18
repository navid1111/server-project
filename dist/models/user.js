"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    githubId: { type: String, required: true, unique: true },
    displayName: { type: String },
    username: { type: String },
    profileUrl: { type: String },
    photos: [{ value: String }],
    email: { type: String },
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
