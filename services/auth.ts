import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/user';

class AuthService {
  private JWT_SECRET: string;

  constructor() {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRE) {
      throw new Error('JWT configuration is missing');
    }
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  public generateToken(user: IUser): string {
    const signOptions: SignOptions = {
      expiresIn: '30d',
    };

    return jwt.sign(
      {
        id: user._id,
        provider: user.provider,
      },
      this.JWT_SECRET,
      signOptions,
    );
  }

  public async matchPassword(
    enteredPassword: string,
    user: IUser,
  ): Promise<boolean> {
    if (!user.password) {
      throw new Error('User has no password set (OAuth user)');
    }
    return await bcrypt.compare(enteredPassword, user.password);
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}

export const authService = new AuthService();
export default authService;
