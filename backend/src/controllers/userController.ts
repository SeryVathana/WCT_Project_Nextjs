import { RequestHandler } from 'express';
import { auth } from '../configs/firebase.config';

import UserModel from '../models/userSchema';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ObjectId } from 'mongodb';

type SignInBody = {
  email: string;
  password: string;
};

export const getUser: RequestHandler = async (req, res, next) => {
  const inputId = req.params.id;

  try {
    const user = await UserModel.find({ _id: inputId });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};

// export const signInUser: RequestHandler<unknown, unknown, SignInBody, unknown> = async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   try {
//     const user = await signInWithEmailAndPassword(auth, email, password);
//     res.send(user);
//   } catch (err) {
//     res.send(err);
//   }
// };

type SignUpBody = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthDate: string;
  photoURL: string;
  uid: string;
};

export const createUser: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res) => {
  const inputData = {
    _id: req.body.uid,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    displayName: req.body.firstname + ' ' + req.body.lastname,
    photoURL: req.body.photoURL,
    birthDate: req.body.birthDate,
    email: req.body.email,
  };

  try {
    const user = await UserModel.create(inputData);
    res.status(200).json(user);
  } catch (err) {
    res.status(409).send(err);
  }
};
