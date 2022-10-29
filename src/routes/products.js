"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const admin_1 = __importDefault(require("../middleware/admin"));
const products_1 = require("../controllers/products");
const router = (0, express_1.Router)();
router.get('/', products_1.getProducts);
router.get('/search', products_1.searchProducts);
router.get('/categories', products_1.getCategories);
router.get('/favourites/', auth_1.default, products_1.getFavourites);
router.get('/stats', auth_1.default, admin_1.default, products_1.getStats);
router.get('/:id', products_1.getProduct);
router.post('/favourites/:id', auth_1.default, products_1.toggleFavourite);
exports.default = router;
