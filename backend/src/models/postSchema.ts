import { InferSchemaType, Schema, model } from 'mongoose';

const postSchema = new Schema(
  {
    itemName: { type: String, require: true },
    price: { type: Number },
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>;

export default model<Post>('Post', postSchema);
