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
exports.deleteOrder = exports.getAllOrders = exports.updateOrderStatus = exports.getMyOrders = exports.getOrder = exports.updateDelivery = exports.updatePayment = exports.createOrder = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const db_1 = require("../db/db");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email_address, products, full_name, address, country, postal_code, city, payment_method, items_price, shipping_price, tax_price, total_price, } = req.body;
    const payment = (yield (0, db_1.query)('INSERT INTO payments (status, email_address) VALUES ($1, $2) RETURNING *;', ['paid', email_address])).rows[0];
    const order = (yield (0, db_1.query)('INSERT INTO orders (full_name, address, country, postal_code, city, payment_method, payment_id, items_price, shipping_price, tax_price, total_price, user_id, is_paid, paid_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, $13) RETURNING *;', [
        full_name,
        address,
        country,
        postal_code,
        city,
        payment_method,
        payment.id,
        items_price,
        shipping_price,
        tax_price,
        total_price,
        res.locals.user.id,
        new Date(),
    ])).rows[0];
    for (const product of products) {
        yield (0, db_1.query)('INSERT INTO order_product (order_id, product_id, quantity) VALUES ($1, $2, $3);', [order.id, product.id, product.quantity]);
    }
    const fullProducts = (yield (0, db_1.query)('SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;', [order.id])).rows;
    order.products = fullProducts;
    order.payment = payment;
    res.status(http_status_codes_1.StatusCodes.OK).json(order);
});
exports.createOrder = createOrder;
const updatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = (yield (0, db_1.query)('UPDATE orders SET is_paid = $1, paid_at = $2 RETURNING *;', [
        true,
        new Date(),
    ])).rows[0];
    const updatedPayment = (yield (0, db_1.query)('UPDATE payments SET status = $1, update_time = $2 WHERE id = $3 RETURNING *;', ['paid', new Date(), order.payment_id])).rows[0];
    order.payment = updatedPayment;
    const fullProducts = (yield (0, db_1.query)('SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;', [order.id])).rows;
    order.products = fullProducts;
    res.status(http_status_codes_1.StatusCodes.OK).json(order);
});
exports.updatePayment = updatePayment;
const updateDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = (yield (0, db_1.query)('UPDATE orders SET is_delivered = $1, delivered_at = $2 RETURNING *;', [true, new Date()])).rows[0];
    const payment = (yield (0, db_1.query)('SELECT * FROM payments WHERE id = $1;', [order.payment_id])).rows[0];
    order.payment = payment;
    const fullProducts = (yield (0, db_1.query)('SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;', [order.id])).rows;
    order.products = fullProducts;
    res.status(http_status_codes_1.StatusCodes.OK).json(order);
});
exports.updateDelivery = updateDelivery;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = (yield (0, db_1.query)('SELECT * FROM orders WHERE id = $1;', [req.params.id])).rows[0];
    if (order) {
        const fullProducts = (yield (0, db_1.query)('SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;', [order.id])).rows;
        order.products = fullProducts;
        const payment = (yield (0, db_1.query)('SELECT * FROM payments WHERE id = $1;', [order.payment_id])).rows[0];
        order.payment = payment;
        return res.status(http_status_codes_1.StatusCodes.OK).json(order);
    }
    else {
        throw new errors_1.NotFoundError(`Order with id ${req.params.id} not found.`);
    }
});
exports.getOrder = getOrder;
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = (yield (0, db_1.query)('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC;', [res.locals.user.id])).rows;
    // for (const order of orders) {
    //   const fullProducts = (
    //     await query(
    //       'SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;',
    //       [order.id]
    //     )
    //   ).rows;
    //   const payment = (
    //     await query('SELECT * FROM payments WHERE id = $1;', [order.payment_id])
    //   ).rows[0];
    //   order.products = fullProducts;
    //   order.payment = payment;
    // }
    res.status(http_status_codes_1.StatusCodes.OK).json(orders);
});
exports.getMyOrders = getMyOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = (yield (0, db_1.query)('UPDATE orders SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [status, new Date(), id])).rows[0];
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedOrder);
});
exports.updateOrderStatus = updateOrderStatus;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { created_at } = req.query || 'year';
    const orders = (created_at === 'today'
        ? yield (0, db_1.query)("SELECT * FROM orders WHERE created_at >= now()::date - interval '0h' ORDER BY created_at DESC;", [])
        : created_at === 'week'
            ? yield (0, db_1.query)("SELECT * FROM orders WHERE created_at >= now()::date - interval '7d' ORDER BY created_at DESC;", [])
            : created_at === 'month'
                ? yield (0, db_1.query)("SELECT * FROM orders WHERE created_at >= now()::date - interval '30d' ORDER BY created_at DESC;", [])
                : yield (0, db_1.query)("SELECT * FROM orders WHERE created_at >= now()::date - interval '365d' ORDER BY created_at DESC;", [])).rows;
    // for (const order of orders) {
    //   const fullProducts = (
    //     await query(
    //       'SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;',
    //       [order.id]
    //     )
    //   ).rows;
    //   const payment = (
    //     await query('SELECT * FROM payments WHERE id = $1;', [order.payment_id])
    //   ).rows[0];
    //   order.products = fullProducts;
    //   order.payment = payment;
    // }
    res.status(http_status_codes_1.StatusCodes.OK).json(orders);
});
exports.getAllOrders = getAllOrders;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.query)('DELETE FROM order_product WHERE order_id = $1;', [
        req.params.id,
    ]);
    yield (0, db_1.query)('DELETE FROM orders WHERE id = $1;', [req.params.id]);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'deleted' });
});
exports.deleteOrder = deleteOrder;
