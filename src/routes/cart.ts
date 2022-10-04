import { Router } from 'express';

const router = Router();

import {
  addProductToCart,
  incrementProduct,
  decrementProduct,
  removeProduct,
  clearCart,
  getCart,
} from '../controllers/cart';

router.get('/', getCart);

router.post('/', addProductToCart);

router.post('/:id/increment', incrementProduct);

router.post('/:id/decrement', decrementProduct);

router.delete('/', clearCart);

router.delete('/:id', removeProduct);

export default router;
