import express, { Request, Response } from 'express';
import passport from 'passport';
import { getMe, login, register } from '../controllers/auth';
import { protect } from '../middlewares/protect';

const router = express.Router();

// Initialize GitHub authentication
router.get('/github', passport.authenticate('github'));

// GitHub callback route
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect home
    res.redirect('/');
  },
);
router.post('/register', register);

router.post('/login', login);
router.get('/me', protect, getMe);
// Logout route
router.get('/logout', (req: Request, res: Response, next) => {
  // Modern version of passport requires callback

  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;
