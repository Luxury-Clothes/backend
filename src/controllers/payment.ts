const stripe = require('stripe')(process.env.STRIPE_KEY);
import { Request, Response } from 'express';

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount, currency } = req.body;

  const payableAmount = parseInt(amount) * 100;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: payableAmount,
    currency: currency, // put your currency
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
