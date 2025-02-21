import { Document, Schema, Types, model } from 'mongoose';

interface IQuestion extends Document {
  title: string;
  body: string;
  tags: string[];
  author: Types.ObjectId;
  votes: number;
}

const questionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Question = model<IQuestion>('Question', questionSchema);

export default Question;
