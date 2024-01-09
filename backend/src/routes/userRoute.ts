import express from 'express';
import { createUser, getUser, updateUser } from '../controllers/userController';

const router = express.Router();

// router.post('/sign-in-with-email', signInUser);
router.post('/create-user', createUser);

router.get('/:id', getUser);

router.patch('/:id', updateUser);

export default router;
