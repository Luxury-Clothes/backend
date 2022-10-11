import { Router } from 'express';

import {
  sendMessage,
  getMessages,
  updateMessage,
} from '../controllers/messages';

const router = Router();

router.post('/', sendMessage);

router.get('/', getMessages);

router.patch('/:id', updateMessage);

export default router;
