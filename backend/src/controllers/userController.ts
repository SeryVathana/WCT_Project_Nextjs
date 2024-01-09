import { RequestHandler } from 'express';
import UserModel from '../models/userSchema';

export const getUser: RequestHandler = async (req, res, next) => {
  const inputId = req.params.id;

  try {
    const user = await UserModel.find({ _id: inputId });

    if (!user) {
      res.send(404).json({ message: 'user not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.send(404).json({ message: 'user not found' });
  }
};

type CreateUserBody = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthDate: string;
  photoURL: string;
  uid: string;
  isModerator: boolean;
};

export const createUser: RequestHandler<unknown, unknown, CreateUserBody, unknown> = async (req, res) => {
  const inputData = {
    _id: req.body.uid,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    displayName: req.body.lastname + ' ' + req.body.firstname,
    photoURL: req.body.photoURL,
    birthDate: req.body.birthDate,
    email: req.body.email,
    isModerator: false,
  };

  try {
    const user = await UserModel.create(inputData);
    res.status(200).json(user);
  } catch (err) {
    res.status(409).send(err);
  }
};

type UpdateUserParams = {
  id: string;
};
type UpdateUserBody = {
  reqBody: {
    firstName: string;
    lastName: string;
    birthDate: string;
  };
};

export const updateUser: RequestHandler<UpdateUserParams, unknown, UpdateUserBody, unknown> = async (req, res) => {
  const inputId = req.params.id;
  try {
    const user = await UserModel.findOne({ _id: inputId }).exec();

    if (!user) {
      throw Error('No post founded');
    }

    user.firstName = req.body.reqBody.firstName;
    user.lastName = req.body.reqBody.lastName;
    user.birthDate = new Date(req.body.reqBody.birthDate);

    user.save();

    console.log(user);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
};
