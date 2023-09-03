import express, { Request, Response } from 'express';
import { ordersController } from '../../..';
import {OrdersControllerResponse} from '../../../orders/orders_controller';

const router = express.Router();

router.use((req, _, next) => {
  console.log('Orders', Date.now(), req.path, req.query);
  next();
});

router.get('/', async (req: Request, res: Response) => {
  const page: number = parseInt(req.query.page as string) || 1;
  const size: number = parseInt(req.query.size as string) || 10;

  const ordersResponse: OrdersControllerResponse = ordersController.getOrders(page, size);

  if (ordersResponse.failure) {
    return res.status(400).json({
      message: ordersResponse.message,
    });
  }

  res.json({
    message: ordersResponse.message,
    data: ordersResponse.data
  });
});

router.post('/', async(req: Request, res: Response) => {
  res.json({message: 'create order'});
});

router.delete('/', async(req: Request, res: Response) => {
  res.json({message: 'cancel order'});
});

router.put('/', async(req: Request, res: Response) => {
  res.json({message: 'update order'});
});

export default router;
