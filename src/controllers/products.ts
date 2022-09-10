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
