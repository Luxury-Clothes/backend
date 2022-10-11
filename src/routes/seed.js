"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seed_1 = require("../controllers/seed");
const router = (0, express_1.Router)();
router.post('/createTable', seed_1.createTable);
exports.default = router;
