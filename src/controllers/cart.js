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
exports.clearCart = exports.removeProduct = exports.decrementProduct = exports.incrementProduct = exports.addProductToCart = exports.getCart = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../db/db");
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = (yield (0, db_1.query)('SELECT * FROM cart INNER JOIN products ON cart.product_id = products.id WHERE cart.user_id = $1;', [res.locals.user.id])).rows;
    for (const product of products) {
        const images = (yield (0, db_1.query)('SELECT image_url FROM product_image WHERE product_id = $1;', [product.id])).rows;
        product.images = images.map(({ image_url }) => image_url);
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json(products);
});
exports.getCart = getCart;
const addProductToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = (yield (0, db_1.query)('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2;', [
        res.locals.user.id,
        req.body.product.id,
    ])).rows[0];
    if (product) {
        yield (0, db_1.query)('UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3;', [+product.quantity + 1, res.locals.user.id, product.product_id]);
    }
    else {
        yield (0, db_1.query)('INSERT INTO cart VALUES($1, $2, $3);', [
            res.locals.user.id,
            req.body.product.id,
            1,
        ]);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'success' });
});
exports.addProductToCart = addProductToCart;
const incrementProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.query)('UPDATE cart SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2;', [res.locals.user.id, req.params.id]);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'success' });
});
exports.incrementProduct = incrementProduct;
const decrementProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.query)('UPDATE cart SET quantity = GREATEST(quantity - 1, 1) WHERE user_id = $1 AND product_id = $2;', [res.locals.user.id, req.params.id]);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'success' });
});
exports.decrementProduct = decrementProduct;
const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.query)('DELETE FROM CART WHERE product_id = $1 AND user_id = $2', [
        req.params.id,
        res.locals.user.id,
    ]);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'success' });
});
exports.removeProduct = removeProduct;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.query)('DELETE FROM CART WHERE user_id = $1', [res.locals.user.id]);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'success' });
});
exports.clearCart = clearCart;
