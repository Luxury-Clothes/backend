import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { query } from '../db/db';

export const getCart = async (req: Request, res: Response) => {
  const products = (
    await query(
      'SELECT * FROM cart INNER JOIN products ON cart.product_id = products.id WHERE cart.user_id = $1;',
      [res.locals.user.id]
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

  return res.status(StatusCodes.OK).json(products);
};

export const addProductToCart = async (req: Request, res: Response) => {
  const product = (
    await query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2;', [
      res.locals.user.id,
      req.body.product.id,
    ])
  ).rows[0];

  if (product) {
    await query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3;',
      [+product.quantity + 1, res.locals.user.id, product.product_id]
    );
  } else {
    await query('INSERT INTO cart VALUES($1, $2, $3);', [
      res.locals.user.id,
      req.body.product.id,
      1,
    ]);
  }
  res.status(StatusCodes.OK).json({ message: 'success' });
};

export const incrementProduct = async (req: Request, res: Response) => {
  await query(
    'UPDATE cart SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2;',
    [res.locals.user.id, req.params.id]
  );
  res.status(StatusCodes.OK).json({ message: 'success' });
};

export const decrementProduct = async (req: Request, res: Response) => {
  await query(
    'UPDATE cart SET quantity = GREATEST(quantity - 1, 1) WHERE user_id = $1 AND product_id = $2;',
    [res.locals.user.id, req.params.id]
  );
  res.status(StatusCodes.OK).json({ message: 'success' });
};

export const removeProduct = async (req: Request, res: Response) => {
  await query('DELETE FROM CART WHERE product_id = $1 AND user_id = $2', [
    req.params.id,
    res.locals.user.id,
  ]);
  res.status(StatusCodes.OK).json({ message: 'success' });
};

export const clearCart = async (req: Request, res: Response) => {
  await query('DELETE FROM CART WHERE user_id = $1', [res.locals.user.id]);
  res.status(StatusCodes.OK).json({ message: 'success' });
};
