import { Router } from 'express';


import auth from '../middleware/auth';
import {
  getProduct,
  getProducts,
  searchProducts,
  getCategories,
  getFavourites,
  toggleFavourite,
} from '../controllers/products';

const router = Router();

router.get('/', getProducts);

router.get('/search', searchProducts);

router.get('/categories', getCategories);

router.get('/favourites/', auth, getFavourites);

router.get('/:id', getProduct);

router.post('/favourites/:id', auth, toggleFavourite);

export default router;
