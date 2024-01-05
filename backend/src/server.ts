import 'dotenv/config';
import env from './utils/envValidate';
import app from './app';
import mongoose from 'mongoose';

const PORT = env.PORT || 5000;

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log('Mongodb connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
