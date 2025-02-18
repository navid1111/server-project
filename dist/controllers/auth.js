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
exports.login = exports.register = void 0;
const validator_1 = __importDefault(require("validator"));
const async_1 = __importDefault(require("../middlewares/async"));
const user_1 = __importDefault(require("../models/user"));
const auth_1 = __importDefault(require("../services/auth"));
const erroResponse_1 = __importDefault(require("../utils/erroResponse"));
/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { first_name, last_name, email, password, role } = req.body;
    // Trim and sanitize inputs
    first_name = validator_1.default.trim(first_name || '');
    last_name = validator_1.default.trim(last_name || '');
    email = validator_1.default.trim(email || '').toLowerCase();
    password = validator_1.default.trim(password || '');
    // Input validation
    if (!first_name || !last_name || !email || !password) {
        return next(new erroResponse_1.default('All fields are required', 400));
    }
    // Validate email format
    if (!validator_1.default.isEmail(email)) {
        return next(new erroResponse_1.default('Invalid email format', 400));
    }
    // Check if user already exists (case insensitive)
    const existingUser = yield user_1.default.findOne({ email }).collation({
        locale: 'en',
        strength: 2,
    });
    if (existingUser) {
        return next(new erroResponse_1.default('Email already registered', 400));
    }
    // Create user with sanitized inputs
    const user = yield user_1.default.create({
        first_name,
        last_name,
        email,
        password, // Password will be hashed in the model pre-save hook
        role: role || 'user',
    });
    const token = yield auth_1.default.generateToken(user);
    // Remove sensitive data from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).json({
        success: true,
        data: { user: userWithoutPassword, token },
    });
}));
/**
 * @route   POST /api/v1/auth/login
 * @desc    Login a user
 * @access  Public
 */
exports.login = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    // Trim and sanitize inputs
    email = validator_1.default.trim(email || '').toLowerCase();
    password = validator_1.default.trim(password || '');
    // Input validation
    if (!email || !password) {
        return next(new erroResponse_1.default('Please provide an email and password', 400));
    }
    // Validate email format
    if (!validator_1.default.isEmail(email)) {
        return next(new erroResponse_1.default('Invalid email format', 400));
    }
    // Find user with case-insensitive email match
    const user = yield user_1.default.findOne({ email })
        .collation({ locale: 'en', strength: 2 })
        .select('+password');
    if (!user) {
        return next(new erroResponse_1.default('Invalid credentials', 401)); // Generic message
    }
    // Check password
    const isMatched = yield auth_1.default.matchPassword(password, user);
    if (!isMatched) {
        return next(new erroResponse_1.default('Invalid credentials', 401));
    }
    // Generate token
    const token = yield auth_1.default.generateToken(user);
    // Remove sensitive data from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(200).json({
        success: true,
        data: { user: userWithoutPassword, token },
    });
}));
