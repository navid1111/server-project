import bcrypt from 'bcryptjs';
import { Document, Model, Schema, model } from 'mongoose';

export interface IUser extends Document {
  githubId?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
  photos?: { value: string }[];
  email: string;
  password?: string;
  provider: 'local' | 'github';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    githubId: {
      type: String,
      sparse: true,
      index: true,
    },
    displayName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
    },
    profileUrl: {
      type: String,
    },
    photos: [
      {
        value: String,
      },
    ],
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't include password by default in queries
    },
    provider: {
      type: String,
      required: true,
      enum: ['local', 'github'],
      default: 'local',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

const User: Model<IUser> = model<IUser>('User', UserSchema);

export default User;
