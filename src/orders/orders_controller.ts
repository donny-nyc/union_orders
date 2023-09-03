import OrdersRepo from "./repos/orders_repository_i";
import DummyOrdersRepo from './repos/dummy_orders_repository';
import Order from "./types/order";

export interface OrdersControllerResponse {
  message: string;
  failure: boolean;
  data?: any;
};

class OrdersController {
  private repository: OrdersRepo;

  private constructor(repo: OrdersRepo) {
    this.repository = repo;
  }

  public getOrders(page: number = 1, size: number = 10) {
    if (page < 1 || size < 1) {
      return {
        message: `arguments must be positive`,
        failure: true
      };
    }

    try {
      const orders: Order[] = this.repository.paginatedFetchOrders(page, size);

      return {
        message: `page ${page}`,
        failure: false,
        data: {
          orders
        }
      }
    } catch (e: any) {
      return {
        message: e,
        failure: true,
      }
    }
  }

  public getOrderById(orderId: string): OrdersControllerResponse {
    try {
      const order: Order = this.repository.fetchOrderById(orderId);

      return {
        message: `retrieved order ${orderId}`,
        failure: false,
        data: {
          order
        }
      };
    } catch (e: any) {
      return {
        message: e,
        failure: true
      }
    }
  }

  private seed(orders: Order[]): void {
    this.repository.insertOrders(orders);
  }

  public static newDummyOrdersController(mocks?: Order[]): OrdersController {
    const controller = new OrdersController(DummyOrdersRepo);

    if (mocks) {
      controller.seed(mocks);
    }

    return controller;
  }
};

export default OrdersController;
