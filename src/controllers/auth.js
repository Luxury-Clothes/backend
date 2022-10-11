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
exports.me = exports.register = exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const validation_1 = require("../utils/validation");
const http_status_codes_1 = require("http-status-codes");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { errors } = (0, validation_1.validateLoginInput)(email, password);
    if (Object.keys(errors).length > 0)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors });
    const user = (yield (0, db_1.query)('SELECT id, username, password, email, image_url, is_admin FROM users WHERE email = $1 LIMIT 1;', [email])).rows[0];
    if (!user)
        errors.email = 'User not found!';
    if (Object.keys(errors).length > 0)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors });
    const match = yield bcryptjs_1.default.compare(password, user.password);
    if (!match)
        errors.password = 'Password is incorrect';
    if (Object.keys(errors).length > 0)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors });
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('token', token, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 3600 * 24 * 7,
        sameSite: 'strict',
        // sameSite: 'none',
        path: '/',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        id: user.id,
        username: user.username,
        email: user.email,
        image_url: user.image_url,
        is_admin: user.is_admin,
    });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('token', '', {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: +new Date(0),
        // sameSite: 'strict',
        sameSite: 'none',
        path: '/',
    });
    res.json({ message: 'Logout' });
});
exports.logout = logout;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, email, password, confirmPassword } = req.body;
    const { errors } = (0, validation_1.validateRegisterInput)(username, email, password, confirmPassword);
    const userWithUsername = yield (0, db_1.query)('SELECT * FROM users WHERE username = $1;', [username]);
    if (userWithUsername.rows[0])
        errors.username = `User with username ${username} already exist`;
    const userWithEmail = yield (0, db_1.query)('SELECT * FROM users WHERE email = $1;', [
        email,
    ]);
    if (userWithEmail.rows[0])
        errors.email = `User with email ${email} already exist`;
    if (Object.keys(errors).length > 0)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors });
    password = yield bcryptjs_1.default.hash(password, 6);
    const user = (yield (0, db_1.query)('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, image_url, is_admin;', [username, email, password])).rows[0];
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('token', token, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 3600 * 24 * 7,
        // sameSite: 'strict',
        sameSite: 'none',
        path: '/',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(user);
});
exports.register = register;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json(res.locals.user);
});
exports.me = me;
