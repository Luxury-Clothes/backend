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
exports.getStats = exports.toggleFavourite = exports.getFavourites = exports.getCategories = exports.getProduct = exports.searchProducts = exports.getProducts = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const db_1 = require("../db/db");
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 5;
    const allProducts = (yield (0, db_1.query)('SELECT * FROM products;', [])).rows;
    const countProducts = allProducts.length;
    const products = (yield (0, db_1.query)('SELECT * FROM products ORDER BY price DESC OFFSET $1 LIMIT $2;', [pageSize * (page - 1), pageSize])).rows;
    for (const product of products) {
        const images = (yield (0, db_1.query)('SELECT image_url FROM product_image WHERE product_id = $1;', [product.id])).rows;
        product.images = images.map(({ image_url }) => image_url);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
    });
});
exports.getProducts = getProducts;
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 5;
    const search = req.query.search || '';
    const category = req.query.category || 'all';
    const price = req.query.price || 'all';
    const rating = Number(req.query.rating) || 'all';
    const order = req.query.order || 'desc';
    const firstNum = String(price).split('-')[0];
    const secondNum = String(price).split('-')[1];
    const allProducts = (yield (0, db_1.query)('SELECT * FROM products WHERE LOWER(title) LIKE $1 AND LOWER(category) LIKE $2 AND price BETWEEN $3 AND $4 AND rating >= $5;', [
        // @ts-ignore
        '%' + ((_a = search === null || search === void 0 ? void 0 : search.toLowerCase()) === null || _a === void 0 ? void 0 : _a.trim()) + '%',
        category === 'all' ? '%' : '%' + category + '%',
        price === 'all' ? 0 : firstNum,
        price === 'all' ? 999999 : secondNum,
        rating === 'all' ? 0 : rating,
    ])).rows;
    const countProducts = allProducts.length;
    const products = (yield (0, db_1.query)('SELECT * FROM products WHERE LOWER(title) LIKE $1 AND LOWER(category) LIKE $2 AND price BETWEEN $3 AND $4 AND rating >= $5  OFFSET $6 LIMIT $7;', [
        // @ts-ignore
        '%' + ((_b = search === null || search === void 0 ? void 0 : search.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim()) + '%',
        category === 'all' ? '%' : '%' + category + '%',
        price === 'all' ? 0 : firstNum,
        price === 'all' ? 999999 : secondNum,
        rating === 'all' ? 0 : rating,
        pageSize * (page - 1),
        pageSize,
    ])).rows;
    for (const product of products) {
        const images = (yield (0, db_1.query)('SELECT image_url FROM product_image WHERE product_id = $1;', [product.id])).rows;
        product.images = images.map(({ image_url }) => image_url);
    }
    products.sort((a, b) => order === 'desc' ? b.price - a.price : a.price - b.price);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
    });
});
exports.searchProducts = searchProducts;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = (yield (0, db_1.query)('SELECT * FROM products WHERE id = $1;', [req.params.id])).rows[0];
    if (product) {
        const images = (yield (0, db_1.query)('SELECT image_url FROM product_image WHERE product_id = $1;', [product.id])).rows;
        product.images = images.map(({ image_url }) => image_url);
        return res.status(http_status_codes_1.StatusCodes.OK).json(product);
    }
    else {
        throw new errors_1.NotFoundError(`Product with id ${req.params.id} not found.`);
    }
});
exports.getProduct = getProduct;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = (yield (0, db_1.query)('SELECT DISTINCT category FROM products;', [])).rows;
    res.status(http_status_codes_1.StatusCodes.OK).json(categories.map((obj) => obj.category));
});
exports.getCategories = getCategories;
const getFavourites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const favourites = (yield (0, db_1.query)('SELECT * FROM favourites INNER JOIN products ON favourites.product_id = products.id WHERE favourites.user_id = $1;', [res.locals.user.id])).rows;
    for (const product of favourites) {
        const images = (yield (0, db_1.query)('SELECT image_url FROM product_image WHERE product_id = $1;', [product.id])).rows;
        product.images = images.map(({ image_url }) => image_url);
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json(favourites);
});
exports.getFavourites = getFavourites;
const toggleFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const favourite = (yield (0, db_1.query)('SELECT * FROM favourites WHERE user_id = $1 AND product_id = $2;', [res.locals.user.id, req.params.id])).rows[0];
    if (favourite) {
        yield (0, db_1.query)('DELETE FROM favourites WHERE user_id = $1 AND product_id = $2;', [res.locals.user.id, req.params.id]);
    }
    else {
        yield (0, db_1.query)('INSERT INTO favourites VALUES ($1, $2);', [
            res.locals.user.id,
            req.params.id,
        ]);
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'success' });
});
exports.toggleFavourite = toggleFavourite;
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUsers = (yield (0, db_1.query)('SELECT COUNT(*) FROM users WHERE extract(month FROM created_at) = extract(month FROM CURRENT_DATE);', [])).rows[0];
    const newOrders = (yield (0, db_1.query)('SELECT COUNT(*) FROM orders WHERE extract(month FROM created_at) = extract(month FROM CURRENT_DATE);', [])).rows[0];
    const newMessages = (yield (0, db_1.query)('SELECT COUNT(*) FROM messages WHERE extract(month FROM created_at) = extract(month FROM CURRENT_DATE);', [])).rows[0];
    const totalEarnings = (yield (0, db_1.query)('SELECT SUM(quantity * price) as earnings FROM order_product INNER JOIN products ON product_id = id;', [])).rows[0];
    const categories = (yield (0, db_1.query)('SELECT SUM(quantity) as amount, SUM(quantity * price), category FROM order_product INNER JOIN products ON product_id = id GROUP BY category;', [])).rows;
    const monthlyEarnings = (yield (0, db_1.query)('SELECT SUM(total_price), extract(month FROM created_at) as month FROM orders GROUP BY extract(month FROM created_at)', [])).rows;
    res.status(http_status_codes_1.StatusCodes.OK).json({
        newUsers,
        newOrders,
        newMessages,
        totalEarnings,
        categories,
        monthlyEarnings,
    });
});
exports.getStats = getStats;
