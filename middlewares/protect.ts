import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import ErrorResponse from '../utils/erroResponse';

interface JwtPayload {
  id: string;
}
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;

  // Get token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Check Authorization header as fallback
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token is found, deny access
  if (!token) {
    return next(new ErrorResponse('Not authorized, no token found', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Fetch user and attach to request object excluding password
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Attach entire user object to request
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized, invalid token', 401));
  }
};
