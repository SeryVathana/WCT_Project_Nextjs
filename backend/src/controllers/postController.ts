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
export const getAcceptedPosts: RequestHandler = async (req, res, next) => {
  try {
    const postes = await PostModel.find({ pending: false });
    res.status(200).json(postes);
  } catch (err) {
    console.log(err);
  }
};

export const getMyPosts: RequestHandler = async (req, res, next) => {
  console.log(req.params.uid);
  try {
    const postes = await PostModel.find({ 'seller.id': req.params.uid });
    res.status(200).json(postes);
  } catch (err) {
    console.log(err);
  }
};

export const getPost: RequestHandler = async (req, res, next) => {
  const inputId = req.params.postid;

  try {
    const post = await PostModel.findById(inputId).exec();

    if (!post) {
      throw new Error();
    }

    res.status(200).json(post);
  } catch (err) {
    res.send({ message: err });
  }
};

type SellerType = {
  id: string;
  name: string;
  email: string;
  pfImgURL: string;
};

type ImgType = {
  downloadURL: string;
  name: string;
  storageFileName: string;
  type: string;
};

type BidHistoryType = {
  bidder?: string;
  price?: string;
  date?: Date;
};

type LocationType = {
  country: string;
  district: string;
  city: string;
};

type CreatePostBody = {
  itemName?: string;
  itemDescription?: string;
  biddingHistory?: BidHistoryType[];
  initialPrice?: number;
  bidIncrement?: number;
  location?: LocationType;
  category?: string;
  pending?: boolean;
  displayImg?: ImgType;
  othersImg?: ImgType[];
  seller?: SellerType;
  endDate?: string;
};

export const createPost: RequestHandler<unknown, unknown, CreatePostBody, unknown> = async (req, res, next) => {
  const inputData = req.body;

  console.log(inputData);

  try {
    const newPost = await PostModel.create(inputData);
    res.status(200).json(newPost);
  } catch (err) {
    res.send({ message: err });
  }
};

type UpdatePostParams = {
  postid: string;
};

type UpdatePostBody = {
  pending: boolean;
  biddingHistory: object;
};

export const updatePost: RequestHandler<UpdatePostParams, unknown, any, unknown> = async (req, res, next) => {
  const inputId = req.params.postid;

  try {
    const post = await PostModel.findById(inputId).exec();

    if (!post) {
      throw Error('No post founded');
    }

    if ('pending' in req.body) {
      post.pending = req.body.pending;
      console.log('Hi');
    } else if ('biddingHistory' in req.body) {
      post.biddingHistory.push(req.body.biddingHistory);
    }

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
