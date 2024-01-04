import { InferSchemaType, Schema, model } from 'mongoose';

const postSchema = new Schema(
  {
    itemName: { type: String, require: true },
    price: { type: Number },
    itemDescription: { type: String },
    initialPrice: { type: Number },
    bidIncrement: { type: Number },
    location: { type: Object },
    category: { type: String },
    pending: { type: Boolean },
    displayImg: { type: Object },
    othersImg: { type: Array },
    seller: { type: Object },
    endDate: { type: String },
    biddingHistory: { type: Array },
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>;

export default model<Post>('Post', postSchema);
