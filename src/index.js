"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
require("dotenv/config");
require("colors");
const swaggerUI = __importStar(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const swaggerDocument = yamljs_1.default.load('./swagger.yaml');
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = __importDefault(require("./middleware/error"));
const auth_1 = __importDefault(require("./middleware/auth"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const auth_2 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const seed_1 = __importDefault(require("./routes/seed"));
const upload_1 = __importDefault(require("./routes/upload"));
const payment_1 = __importDefault(require("./routes/payment"));
const cart_1 = __importDefault(require("./routes/cart"));
const messages_1 = __importDefault(require("./routes/messages"));
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get('/', (req, res) => {
    res.send(`<h1><a href="/docs">Go to Docs</a></h1>`);
});
app.use('/api/auth', auth_2.default);
app.use('/api/products', products_1.default);
app.use('/api/orders', auth_1.default, orders_1.default);
app.use('/api/seed', seed_1.default);
app.use('/api/upload', auth_1.default, upload_1.default);
app.use('/api/payment', auth_1.default, payment_1.default);
app.use('/api/cart', auth_1.default, cart_1.default);
app.use('/api/messages', auth_1.default, messages_1.default);
app.use(error_1.default);
app.use(notFound_1.default);
const PORT = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`.green.bold));
    }
    catch (error) {
        console.log(error);
    }
});
start();
