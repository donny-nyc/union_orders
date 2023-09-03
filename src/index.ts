import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

app.get('/', (_: Request, res: Response) => {
  res.json({message: 'orders'});
});

app.listen(port, () => {
  console.log(`[orders service]: listening on http://localhost:${port}`);
});
