"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const auth_1 = __importDefault(require("../middleware/auth"));
const admin_1 = __importDefault(require("../middleware/admin"));
const router = (0, express_1.Router)();
router.get('/search', users_1.searchUsers);
router.patch('/:id', auth_1.default, admin_1.default, users_1.updateUserStatus);
exports.default = router;
