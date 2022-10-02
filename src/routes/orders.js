"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = require("../controllers/orders");
const router = (0, express_1.Router)();
router.get('/', orders_1.getMyOrders);
router.get('/:id', orders_1.getOrder);
router.post('/', orders_1.createOrder);
router.patch('/payment/:id', orders_1.updatePayment);
router.patch('/delivery/:id', orders_1.updateDelivery);
router.delete('/:id', orders_1.deleteOrder);
exports.default = router;