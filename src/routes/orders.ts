import { Router } from 'express';

import {
  getOrder,
  getAllOrders,
  getMyOrders,
  createOrder,
  updateDelivery,
  updatePayment,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orders';

import auth from '../middleware/auth';
import admin from '../middleware/admin';

const router = Router();

router.get('/', auth, getMyOrders);

router.get('/all', auth, admin, getAllOrders);

router.get('/:id', auth, getOrder);

router.post('/', auth, createOrder);

router.patch('/payment/:id', auth, updatePayment);

router.patch('/delivery/:id', auth, updateDelivery);

router.patch('/:id', auth, admin, updateOrderStatus);

router.delete('/:id', auth, deleteOrder);

export default router;
