import { Document, Schema, Types, model } from 'mongoose';

interface IComment extends Document {
  body: string;
  author: Types.ObjectId;
  parentId: Types.ObjectId;
  parentType: 'Question' | 'Answer';
}

const commentSchema = new Schema<IComment>(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, required: true },
    parentType: { type: String, enum: ['Question', 'Answer'], required: true },
  },
  { timestamps: true },
);

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
