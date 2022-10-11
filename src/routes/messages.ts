import { Router } from 'express';

import {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from '../controllers/messages';

const router = Router();

router.post('/', sendMessage);

router.get('/', getMessages);

router.patch('/:id', updateMessage);

router.delete('/:id', deleteMessage);

export default router;
