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
  const queryName = req.query.name;
  const queryCate = req.query.category;

  try {
    let postes;

    if (!queryName && (!queryCate || queryCate == 'all')) {
      postes = await PostModel.find({
        pending: false,
      });
    } else if (queryName && (!queryCate || queryCate == 'all')) {
      postes = await PostModel.find({
        pending: false,
        itemName: { $regex: req.query.name, $options: 'i' },
      });
    } else if (!queryName && queryCate) {
      postes = await PostModel.find({
        pending: false,
        category: req.query.category,
      });
    } else if (queryName && queryCate) {
      postes = await PostModel.find({
        pending: false,
        itemName: { $regex: req.query.name, $options: 'i' },
        category: req.query.category,
      });
    }

    if (!postes) {
      res.status(200).json([]);
    }

    res.status(200).json(postes);
  } catch (err) {
    console.log(err);
  }
};

export const getMyPosts: RequestHandler = async (req, res, next) => {
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

type CreatePostBody = {
  itemName?: string;
  itemDescription?: string;
  biddingHistory?: BidHistoryType[];
  initialPrice?: number;
  bidIncrement?: number;
  category?: string;
  pending?: boolean;
  displayImg?: ImgType;
  othersImg?: ImgType[];
  seller?: SellerType;
  endDate?: string;
};

export const createPost: RequestHandler<unknown, unknown, CreatePostBody, unknown> = async (req, res, next) => {
  const inputData = req.body;

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

    console.log(req.body);

    if ('pending' in req.body) {
      post.pending = req.body.pending;
    } else if ('biddingHistory' in req.body) {
      post.biddingHistory.push(req.body.biddingHistory);
    } else if ('changedInfo' in req.body) {
      post.itemName = req.body.changedInfo.itemName;
      post.itemDescription = req.body.changedInfo.itemDescription;
      post.initialPrice = req.body.changedInfo.initialPrice;
      post.bidIncrement = req.body.changedInfo.bidIncrement;
      post.category = req.body.changedInfo.category;
      post.endDate = req.body.changedInfo.endDate;
      post.pending = req.body.changedInfo.pending;
    }

    const updatedPost = post.save();

    res.status(200).json(updatedPost);
    // res.status(200);
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
