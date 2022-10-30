import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotFoundError } from '../errors';
import { query } from '../db/db';

export const getProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  const pageSize = Number(req.query.pageSize) || 5;

  const allProducts = (await query('SELECT * FROM products;', [])).rows;

  const countProducts = allProducts.length;

  const products = (
    await query(
      'SELECT * FROM products ORDER BY price DESC OFFSET $1 LIMIT $2;',
      [pageSize * (page - 1), pageSize]
    )
  ).rows;

  for (const product of products) {
    const images = (
      await query(
        'SELECT image_url FROM product_image WHERE product_id = $1;',
        [product.id]
      )
    ).rows;
    product.images = images.map(({ image_url }) => image_url);
  }

  res.status(StatusCodes.OK).json({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
};

export const searchProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  const pageSize = Number(req.query.pageSize) || 5;

  const search = req.query.search || '';

  const category = req.query.category || 'all';

  const price = req.query.price || 'all';

  const rating = Number(req.query.rating) || 'all';

  const order = req.query.order || 'desc';

  const firstNum = String(price).split('-')[0];
  const secondNum = String(price).split('-')[1];

  const allProducts = (
    await query(
      'SELECT * FROM products WHERE LOWER(title) LIKE $1 AND LOWER(category) LIKE $2 AND price BETWEEN $3 AND $4 AND rating >= $5;',
      [
        // @ts-ignore
        '%' + search?.toLowerCase()?.trim() + '%',
        category === 'all' ? '%' : '%' + category + '%',
        price === 'all' ? 0 : firstNum,
        price === 'all' ? 999999 : secondNum,
        rating === 'all' ? 0 : rating,
      ]
    )
  ).rows;

  const countProducts = allProducts.length;

  const products = (
    await query(
      'SELECT * FROM products WHERE LOWER(title) LIKE $1 AND LOWER(category) LIKE $2 AND price BETWEEN $3 AND $4 AND rating >= $5  OFFSET $6 LIMIT $7;',
      [
        // @ts-ignore
        '%' + search?.toLowerCase()?.trim() + '%',
        category === 'all' ? '%' : '%' + category + '%',
        price === 'all' ? 0 : firstNum,
        price === 'all' ? 999999 : secondNum,
        rating === 'all' ? 0 : rating,
        pageSize * (page - 1),
        pageSize,
      ]
    )
  ).rows;

  for (const product of products) {
    const images = (
      await query(
        'SELECT image_url FROM product_image WHERE product_id = $1;',
        [product.id]
      )
    ).rows;
    product.images = images.map(({ image_url }) => image_url);
  }

  products.sort((a, b) =>
    order === 'desc' ? b.price - a.price : a.price - b.price
  );

  res.status(StatusCodes.OK).json({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = (
    await query('SELECT * FROM products WHERE id = $1;', [req.params.id])
  ).rows[0];
  if (product) {
    const images = (
      await query(
        'SELECT image_url FROM product_image WHERE product_id = $1;',
        [product.id]
      )
    ).rows;
    product.images = images.map(({ image_url }) => image_url);
    return res.status(StatusCodes.OK).json(product);
  } else {
    throw new NotFoundError(`Product with id ${req.params.id} not found.`);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = (
    await query('SELECT DISTINCT category FROM products;', [])
  ).rows;
  res.status(StatusCodes.OK).json(categories.map((obj) => obj.category));
};

export const getFavourites = async (req: Request, res: Response) => {
  const favourites = (
    await query(
      'SELECT * FROM favourites INNER JOIN products ON favourites.product_id = products.id WHERE favourites.user_id = $1;',
      [res.locals.user.id]
    )
  ).rows;
  for (const product of favourites) {
    const images = (
      await query(
        'SELECT image_url FROM product_image WHERE product_id = $1;',
        [product.id]
      )
    ).rows;
    product.images = images.map(({ image_url }) => image_url);
  }
  return res.status(StatusCodes.OK).json(favourites);
};

export const toggleFavourite = async (req: Request, res: Response) => {
  const favourite = (
    await query(
      'SELECT * FROM favourites WHERE user_id = $1 AND product_id = $2;',
      [res.locals.user.id, req.params.id]
    )
  ).rows[0];

  if (favourite) {
    await query(
      'DELETE FROM favourites WHERE user_id = $1 AND product_id = $2;',
      [res.locals.user.id, req.params.id]
    );
  } else {
    await query('INSERT INTO favourites VALUES ($1, $2);', [
      res.locals.user.id,
      req.params.id,
    ]);
  }
  return res.status(StatusCodes.OK).json({ message: 'success' });
};

export const getStats = async (req: Request, res: Response) => {
  const newUsers = (
    await query(
      'SELECT COUNT(*) FROM users WHERE extract(month FROM created_at) = extract(month FROM CURRENT_DATE);',
      []
    )
  ).rows[0];
  const oldUsers = (
    await query(
      'SELECT COUNT(*) FROM users WHERE extract(month FROM created_at) = extract(month FROM CURRENT_DATE) - 1;',
      []
    )
  ).rows[0];
  const newOrders = (
    await query(
      'SELECT COUNT(*) FROM orders WHERE extract(month FROM created_at) = extract(month FROM CURRENT_DATE);',
      []
    )
  ).rows[0];
  const oldOrders = (
    await query(
      'SELECT COUNT(*) FROM orders WHERE extract(month FROM created_at) = extract(month FROM CURRENT_DATE) - 1;',
      []
    )
  ).rows[0];
  const newMessages = (
    await query(
      'SELECT COUNT(*) FROM messages WHERE extract(month FROM created_at) = extract(month FROM CURRENT_DATE);',
      []
    )
  ).rows[0];
  const oldMessages = (
    await query(
      'SELECT COUNT(*) FROM messages WHERE extract(month FROM created_at) = extract(month FROM CURRENT_DATE) - 1;',
      []
    )
  ).rows[0];
  const totalEarnings = (
    await query(
      'SELECT SUM(quantity * price) as earnings FROM order_product INNER JOIN products ON product_id = id;',
      []
    )
  ).rows[0];
  const categories = (
    await query(
      'SELECT SUM(quantity) as amount, SUM(quantity * price), category FROM order_product INNER JOIN products ON product_id = id GROUP BY category;',
      []
    )
  ).rows;
  const monthlyEarnings = (
    await query(
      'SELECT SUM(total_price), extract(month FROM created_at) as month FROM orders GROUP BY extract(month FROM created_at)',
      []
    )
  ).rows;
  res.status(StatusCodes.OK).json({
    users: {
      newUsers,
      oldUsers,
    },
    orders: {
      newOrders,
      oldOrders,
    },
    messages: {
      newMessages,
      oldMessages,
    },
    totalEarnings,
    categories,
    monthlyEarnings,
  });
};
