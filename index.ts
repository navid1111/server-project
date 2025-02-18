import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import connectDB from './config/db';
import passport from './config/passport';
import errorHandler from './middlewares/error';
import authRoutes from './routes/auth';
const port = 8000;

const app: Express = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }),
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `Welcome, ${
        (req.user as any).displayName || 'User'
      }! <a href="/auth/logout">Logout</a>`,
    );
  } else {
    res.send('Welcome! <a href="/auth/github">Login with GitHub</a>');
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('HELLO FROM EXPRESS + TS!!!!');
});

app.get('/hi', (req: Request, res: Response) => {
  res.send('BYEEE!!');
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
