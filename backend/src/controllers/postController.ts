import { RequestHandler } from 'express';
import PostModel from '../models/postSchema';

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const postes = await PostModel.find().exec();
    res.status(200).json(postes);
  } catch (err) {
    console.log(err);
  }
};

export const getPost: RequestHandler = async (req, res, next) => {
  const inputId = req.params.postid;

  try {
    const post = await PostModel.findById(inputId).exec();
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
  }
};

type CreatePostBody = {
  itemName?: string;
  price?: number;
};

export const createPost: RequestHandler<unknown, unknown, CreatePostBody, unknown> = async (req, res, next) => {
  const inputData = req.body;

  try {
    const newPost = await PostModel.create(inputData);
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
  }
};

type UpdatePostParams = {
  postid: string;
};

type UpdatePostBody = {
  itemName?: string;
  price?: number;
};

export const updatePost: RequestHandler<UpdatePostParams, unknown, UpdatePostBody, unknown> = async (req, res, next) => {
  const inputId = req.params.postid;

  try {
    const post = await PostModel.findById(inputId).exec();

    if (!post) {
      throw Error('No post founded');
    }

    post.itemName = req.body.itemName;
    post.price = req.body.price;

    const updatedPost = post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
  }
};

export const deletePost: RequestHandler<UpdatePostParams, unknown, unknown, unknown> = async (req, res, next) => {
  const inputId = req.params.postid;

  try {
    const post = await PostModel.findByIdAndDelete(inputId).exec();

    if (!post) {
      throw Error('No post founded');
    }

    res.status(200).json({ message: 'deleted' });
  } catch (err) {
    console.log(err);
  }
};
