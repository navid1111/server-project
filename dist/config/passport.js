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
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config();
// Your GitHub OAuth app credentials
const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET;
const CALLBACK_URL = 'http://localhost:5000/auth/github/callback';
// Passport serialization
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
// GitHub strategy configuration
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: ['read:org', 'repo'],
}, (accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Check if user already exists
        let user = yield user_1.default.findOne({ githubId: profile.id });
        if (!user) {
            // Create new user if doesn't exist
            user = yield user_1.default.create({
                githubId: profile.id,
                displayName: profile.displayName,
                username: profile.username,
                profileUrl: profile.profileUrl,
                photos: profile.photos,
                email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
            });
        }
        return cb(null, user);
    }
    catch (err) {
        return cb(err, null);
    }
})));
exports.default = passport_1.default;
