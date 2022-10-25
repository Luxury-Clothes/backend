"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = require("../controllers/orders");
const auth_1 = __importDefault(require("../middleware/auth"));
const admin_1 = __importDefault(require("../middleware/admin"));
const router = (0, express_1.Router)();
router.get('/', auth_1.default, orders_1.getMyOrders);
router.get('/all', auth_1.default, admin_1.default, orders_1.getAllOrders);
router.get('/:id', auth_1.default, orders_1.getOrder);
router.post('/', auth_1.default, orders_1.createOrder);
router.patch('/payment/:id', auth_1.default, orders_1.updatePayment);
router.patch('/delivery/:id', auth_1.default, orders_1.updateDelivery);
router.patch('/:id', auth_1.default, admin_1.default, orders_1.updateOrderStatus);
router.delete('/:id', auth_1.default, orders_1.deleteOrder);
exports.default = router;
