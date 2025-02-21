import { Document, Schema, Types, model } from 'mongoose';

interface IAnswer extends Document {
  body: string;
  author: Types.ObjectId;
  question: Types.ObjectId;
  votes: number;
}

const answerSchema = new Schema<IAnswer>(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Answer = model<IAnswer>('Answer', answerSchema);

export default Answer;
