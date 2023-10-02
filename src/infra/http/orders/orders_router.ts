import express, { Request, Response } from 'express';
import { ordersController } from '../../..';
import bodyParser from 'body-parser';

const router = express.Router();

router.use((req, _, next) => {
  console.log('Orders', Date.now(), req.path, req.query);
  next();
});

router.get('/', async (req: Request, res: Response) => {
  const page: number = parseInt(req.query.page as string) || 1;
  const size: number = parseInt(req.query.size as string) || 10;

  const orders = ordersController.getOrders(page, size);

  if (!orders) {
    return res.status(400).json({
      message: 'unable to fetch orders',
    });
  }

  res.json({
    message: 'orders found',
    orders
  });
});

router.post('/', async(_req: Request, res: Response) => {
  console.log('starting a new order');

  const order = ordersController.startNewOrder();

  if (!order) {
    console.error('error: failed to start a new order');
    return res.status(400).json({
      message: 'failed to start a new order',
    });
  }

  res.json({
    message: 'new order started',
    order
  });
});

router.delete('/', async(req: Request, res: Response) => {
  const orderId = req.params.orderId;

  console.log('[cancel order] ', orderId);

  const cancelledOrder = ordersController.cancelOrder(orderId);

  if (!cancelledOrder) {
    console.error(`error: failed to cancel order ${orderId}`);
    return res.status(400).json({
      message: `failed to cancel order: ${orderId}`,
    });
  }

  res.json({
    message: `order ${orderId} cancelled`,
    id: orderId
  });
});

router.put('/add-to-order/:orderId', bodyParser.json(), async(req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const productId = req.body.productId;
  const count = req.body.count;

  console.log(`[add item to order] order: ${orderId}, productId: ${productId}, count: ${count}`);

  const order = ordersController.addProductToOrder(orderId, productId, count);

  if (!order) {
    console.error('failed to add products to order');
    return res.status(400).json({
      message: 'failed to add to order'
    })
  }

  res.json({
    message: 'order updated', 
    order
  });
});

export default router;
