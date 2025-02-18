"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const error_1 = __importDefault(require("./middlewares/error"));
const port = 8000;
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('HELLO FROM EXPRESS + TS!!!!');
});
app.get('/hi', (req, res) => {
    res.send('BYEEE!!');
});
app.use(error_1.default);
app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
