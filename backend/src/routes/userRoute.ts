import express from 'express';
import { createUser, getUser } from '../controllers/userController';

const router = express.Router();

// router.post('/sign-in-with-email', signInUser);
router.post('/create-user', createUser);
router.get('/:id', getUser);

export default router;
