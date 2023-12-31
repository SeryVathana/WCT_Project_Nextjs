import express from 'express';
import uploadRouter from './routes/uploadFileRoute';
import postRouter from './routes/postsRoute';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRouter);

app.use('/upload', uploadRouter);

export default app;
