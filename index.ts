import express, { Express, Request, Response } from 'express';
import connectDB from './config/db';
import errorHandler from './middlewares/error';
const port = 8000;

const app: Express = express();
connectDB();
app.use(express.json());
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
