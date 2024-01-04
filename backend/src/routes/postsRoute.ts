import express from 'express';
import {
  createPost,
  deletePost,
  getAcceptedPosts,
  getMyPosts,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/postController';

const router = express.Router();

router.get('/', getAcceptedPosts);

router.get('/pending', getPosts);

router.get('/mypost/:uid', getMyPosts);

router.get('/:postid', getPost);

router.post('/', createPost);

router.patch('/:postid', updatePost);

router.delete('/:postid', deletePost);

export default router;
