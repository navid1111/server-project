"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
// Initialize GitHub authentication
router.get('/github', passport_1.default.authenticate('github'));
// GitHub callback route
router.get('/github/callback', passport_1.default.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect home
    res.redirect('/');
});
router.post('/register', auth_1.register);
router.post('/login', auth_1.login);
// Logout route
router.get('/logout', (req, res, next) => {
    // Modern version of passport requires callback
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
exports.default = router;
