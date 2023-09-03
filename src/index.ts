import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import OrdersRouter from './infra/http/orders/orders_router';
import OrdersController from './orders/orders_controller';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Inject dependencies
export const ordersController = OrdersController.newDummyOrdersController();

app.use(cors());

app.get('/', (_: Request, res: Response) => {
  res.json({message: 'orders'});
});

app.use('/orders', OrdersRouter);

app.listen(port, () => {
  console.log(`[orders service]: listening on http://localhost:${port}`);
});
