import { Document, Schema, model } from 'mongoose';
import { IUser } from './user';

export interface IQuestion extends Document {
  title: string;
  body: string;
  author: IUser['id'];
  // Add other fields as needed
}

const QuestionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Please add question content'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IQuestion>('Question', QuestionSchema);
