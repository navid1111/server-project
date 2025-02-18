"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const db_1 = __importDefault(require("./config/db"));
const passport_1 = __importDefault(require("./config/passport"));
const auth_1 = __importDefault(require("./routes/auth"));
const port = 8000;
const app = (0, express_1.default)();
dotenv_1.default.config();
(0, db_1.default)();
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));
// Initialize Passport and session
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.use('/auth', auth_1.default);
// Home route
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Welcome, ${req.user.displayName || 'User'}! <a href="/auth/logout">Logout</a>`);
    }
    else {
        res.send('Welcome! <a href="/auth/github">Login with GitHub</a>');
    }
});
app.get('/', (req, res) => {
    res.send('HELLO FROM EXPRESS + TS!!!!');
});
app.get('/hi', (req, res) => {
    res.send('BYEEE!!');
});
app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
