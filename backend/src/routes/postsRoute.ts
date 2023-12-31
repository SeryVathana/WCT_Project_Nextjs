import express from 'express';
import { createPost, deletePost, getPost, getPosts, updatePost } from '../controllers/postController';

const router = express.Router();

router.get('/', getPosts);

router.get('/:postid', getPost);

router.post('/', createPost);

router.patch('/:postid', updatePost);

router.delete('/:postid', deletePost);

export default router;
