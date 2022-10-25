import { Router } from 'express';

import { searchUsers, updateUserStatus } from '../controllers/users';

import auth from '../middleware/auth';
import admin from '../middleware/admin';

const router = Router();

router.get('/search', searchUsers);

router.patch('/:id', auth, admin, updateUserStatus);

export default router;
