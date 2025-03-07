
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../middlewares/async';
import Question from '../models/question';
import User from '../models/user';
import ErrorResponse from '../utils/erroResponse';

// @desc   Make a question
// @route  POST /api/v1/question
// @access Private
export const createQuestion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const questionData = {
      ...req.body,
      author: req.user?.id, // Make sure req.user is properly typed
    };

    const question = await Question.create(questionData);

    res.status(201).json({
      success: true,
      data: question, // Return the created question, not the input data
    });
  },
);

// @desc   Get all questions
// @route  GET /api/v1/question
// @access Public
export const getQuestions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const questions = await Question.find();
    res.status(200).json({ success: true, data: questions });
  },
);
// @desc   Make a question
// @route  GET /api/v1/question/user/:id
// @access Private
export const getQuestionByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(!id) return next(new ErrorResponse("user id is undefined",404));
    const user = await User.findById(id);
    if (!user)
      return next(new ErrorResponse('User not found with this id', 404));
    const questions = await Question.find({ author: id });
    res.status(200).json({ success: true, data: questions });
  },
);

// @desc   Get one question
// @route  POST /api/v1/question/:id
// @access Private
export const getQuestion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
   
    const questions = await Question.findById(id);
    res.status(200).json({ success: true, data: questions });
  },
);





