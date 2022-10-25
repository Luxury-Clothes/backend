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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.searchUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../db/db");
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 5;
    const search = req.query.search || '';
    const allUsers = (yield (0, db_1.query)('SELECT id, username, email, is_admin FROM users WHERE LOWER(username) LIKE $1 OR LOWER(email) LIKE $2;', [
        // @ts-ignore
        '%' + ((_a = search === null || search === void 0 ? void 0 : search.toLowerCase()) === null || _a === void 0 ? void 0 : _a.trim()) + '%',
        // @ts-ignore
        '%' + ((_b = search === null || search === void 0 ? void 0 : search.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim()) + '%',
    ])).rows;
    const countUsers = allUsers.length;
    const users = (yield (0, db_1.query)('SELECT id, username, email, is_admin FROM users WHERE LOWER(username) LIKE $1 OR LOWER(email) LIKE $2 OFFSET $3 LIMIT $4;', [
        // @ts-ignore
        '%' + ((_c = search === null || search === void 0 ? void 0 : search.toLowerCase()) === null || _c === void 0 ? void 0 : _c.trim()) + '%',
        // @ts-ignore
        '%' + ((_d = search === null || search === void 0 ? void 0 : search.toLowerCase()) === null || _d === void 0 ? void 0 : _d.trim()) + '%',
        pageSize * (page - 1),
        pageSize,
    ])).rows;
    res.status(http_status_codes_1.StatusCodes.OK).json({
        users,
        countUsers,
        page,
        pages: Math.ceil(countUsers / pageSize),
    });
});
exports.searchUsers = searchUsers;
const updateUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isAdmin } = req.body;
    const { id } = req.params;
    const updatedUser = (yield (0, db_1.query)('UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, is_admin, username, email;', [isAdmin, id])).rows;
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedUser);
});
exports.updateUserStatus = updateUserStatus;
