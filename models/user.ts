import { Document, Model, Schema, model } from 'mongoose';

export interface IUser extends Document {
  githubId: string;
  displayName?: string;
  username?: string;
  profileUrl?: string;
  photos?: { value: string }[];
  email?: string;
}

const UserSchema: Schema = new Schema({
  githubId: { type: String, required: true, unique: true },
  displayName: { type: String },
  username: { type: String },
  profileUrl: { type: String },
  photos: [{ value: String }],
  email: { type: String },
});

const User: Model<IUser> = model<IUser>('User', UserSchema);

export default User;
