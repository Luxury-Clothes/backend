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
exports.createPaymentIntent = void 0;
const stripe = require('stripe')(process.env.STRIPE_KEY);
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency } = req.body;
    const payableAmount = parseInt(amount) * 100;
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: payableAmount,
        currency: currency, // put your currency
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});
exports.createPaymentIntent = createPaymentIntent;
