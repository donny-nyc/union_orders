import express, { Request, Response } from 'express';
import { ordersController } from '../../..';
import {OrdersControllerResponse} from '../../../orders/orders_controller';
import bodyParser from 'body-parser';

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
  const ordersResponse: OrdersControllerResponse = ordersController.startNewOrder();

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

router.delete('/', async(req: Request, res: Response) => {
  res.json({message: 'cancel order'});
});

router.put('/add-to-order/:orderId', bodyParser.json(), async(req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const productId = req.body.productId;
  const count = req.body.count;

  const ordersResponse: OrdersControllerResponse = ordersController.addProductToOrder(orderId, productId, count);

  if (ordersResponse.failure) {
    console.log('[add product to order] Failure:', ordersResponse.message);
    return res.status(400).json({
      message: ordersResponse.message
    })
  }

  res.json({
    message: ordersResponse.message, 
    data: ordersResponse.data
  });
});

export default router;
