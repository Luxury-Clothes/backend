import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotFoundError } from '../errors';
import { query } from '../db/db';

export const createOrder = async (req: Request, res: Response) => {
  const {
    email_address,
    products,
    full_name,
    address,
    country,
    postal_code,
    city,
    payment_method,
    items_price,
    shipping_price,
    tax_price,
    total_price,
  } = req.body;

  const payment = (
    await query(
      'INSERT INTO payments (status, email_address) VALUES ($1, $2) RETURNING *;',
      ['paid', email_address]
    )
  ).rows[0];

  const order = (
    await query(
      'INSERT INTO orders (full_name, address, country, postal_code, city, payment_method, payment_id, items_price, shipping_price, tax_price, total_price, user_id, is_paid, paid_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, $13) RETURNING *;',
      [
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
      ]
    )
  ).rows[0];

  for (const product of JSON.parse(products)) {
    await query(
      'INSERT INTO order_product (order_id, product_id, quantity) VALUES ($1, $2, $3);',
      [order.id, product, product.quantity]
    );
  }

  const fullProducts = (
    await query(
      'SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;',
      [order.id]
    )
  ).rows;

  order.products = fullProducts;

  order.payment = payment;

  res.status(StatusCodes.OK).json(order);
};

export const updatePayment = async (req: Request, res: Response) => {
  const order = (
    await query('UPDATE orders SET is_paid = $1, paid_at = $2 RETURNING *;', [
      true,
      new Date(),
    ])
  ).rows[0];

  const updatedPayment = (
    await query(
      'UPDATE payments SET status = $1, update_time = $2 WHERE id = $3 RETURNING *;',
      ['paid', new Date(), order.payment_id]
    )
  ).rows[0];

  order.payment = updatedPayment;

  const fullProducts = (
    await query(
      'SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;',
      [order.id]
    )
  ).rows;

  order.products = fullProducts;

  res.status(StatusCodes.OK).json(order);
};

export const updateDelivery = async (req: Request, res: Response) => {
  const order = (
    await query(
      'UPDATE orders SET is_delivered = $1, delivered_at = $2 RETURNING *;',
      [true, new Date()]
    )
  ).rows[0];

  const payment = (
    await query('SELECT * FROM payments WHERE id = $1;', [order.payment_id])
  ).rows[0];

  order.payment = payment;

  const fullProducts = (
    await query(
      'SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;',
      [order.id]
    )
  ).rows;

  order.products = fullProducts;

  res.status(StatusCodes.OK).json(order);
};

export const getOrder = async (req: Request, res: Response) => {
  const order = (
    await query('SELECT * FROM orders WHERE id = $1;', [req.params.id])
  ).rows[0];
  if (order) {
    const fullProducts = (
      await query(
        'SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;',
        [order.id]
      )
    ).rows;
    order.products = fullProducts;
    const payment = (
      await query('SELECT * FROM payments WHERE id = $1;', [order.payment_id])
    ).rows[0];
    order.payment = payment;
    return res.status(StatusCodes.OK).json(order);
  } else {
    throw new NotFoundError(`Order with id ${req.params.id} not found.`);
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  const orders = (
    await query('SELECT * FROM orders WHERE user_id = $1;', [
      res.locals.user.id,
    ])
  ).rows;

  for (const order of orders) {
    const fullProducts = (
      await query(
        'SELECT * FROM products INNER JOIN (SELECT * FROM order_product WHERE order_id = $1) order_product ON products.id = order_product.product_id;',
        [order.id]
      )
    ).rows;
    const payment = (
      await query('SELECT * FROM payments WHERE id = $1;', [order.payment_id])
    ).rows[0];
    order.products = fullProducts;
    order.payment = payment;
  }
  res.status(StatusCodes.OK).json(orders);
};

export const deleteOrder = async (req: Request, res: Response) => {
  await query('DELETE FROM order_product WHERE order_id = $1;', [
    req.params.id,
  ]);
  await query('DELETE FROM orders WHERE id = $1;', [req.params.id]);
  res.status(StatusCodes.OK).json({ message: 'deleted' });
};
