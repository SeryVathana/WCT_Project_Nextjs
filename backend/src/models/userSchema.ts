import { InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    _id: { type: String, require: true },
    itemName: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    displayName: { type: String, require: true },
    photoURL: { type: String },
    birthDate: { type: Date, require: true },
    email: { type: String, require: true },
    isModerator: { type: Boolean, require: true },
  },
  { timestamps: true, _id: false }
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>('User', userSchema);
