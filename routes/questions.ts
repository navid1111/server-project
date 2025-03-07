import express from 'express';
import { createQuestion } from '../controllers/question';
import { protect } from '../middlewares/protect';
const router = express.Router();

router.post('/create', protect, createQuestion);
export default router;
