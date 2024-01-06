import express from 'express';
import uploadRouter from './routes/uploadFileRoute';
import postRouter from './routes/postsRoute';
import userRouter from './routes/userRoute';
import cors from 'cors';
const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://auction-site-wct.vercel.app'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRouter);

app.use('/upload', uploadRouter);

app.use('/user', userRouter);

export default app;
