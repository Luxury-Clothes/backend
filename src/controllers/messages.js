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
exports.deleteMessage = exports.getMessages = exports.updateMessage = exports.sendMessage = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../db/db");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subject, message, isSend } = req.body;
    const newMessage = (yield (0, db_1.query)('INSERT INTO messages (user_id, subject, message, is_send) VALUES ($1, $2, $3, $4) RETURNING *;', [res.locals.user.id, subject, message, isSend])).rows[0];
    res.status(http_status_codes_1.StatusCodes.OK).json(newMessage);
});
exports.sendMessage = sendMessage;
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subject, message, isSend } = req.body;
    const updatedMessage = (yield (0, db_1.query)('UPDATE messages SET subject = $1, message = $2, is_send = $3, updated_at = NOW() WHERE id = $4 RETURNING *;', [subject, message, isSend, req.params.id])).rows[0];
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedMessage);
});
exports.updateMessage = updateMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = (yield (0, db_1.query)('SELECT * FROM messages WHERE user_id = $1;', [
        res.locals.user.id,
    ])).rows;
    res.status(http_status_codes_1.StatusCodes.OK).json(messages);
});
exports.getMessages = getMessages;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.query)('DELETE FROM messages WHERE id = $1 and user_id = $2;', [
        req.params.id,
        res.locals.user.id,
    ]);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'success' });
});
exports.deleteMessage = deleteMessage;
