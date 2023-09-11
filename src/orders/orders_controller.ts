import OrdersRepo from "./repos/orders_repository_i";
import DummyOrdersRepo from './repos/dummy_orders_repository';
import UnhealthyOrdersRepo from './repos/unhealthy_orders_repository';
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

  public addProductToOrder(orderId: string, productId: string, count: number) {
    console.log('[Orders Controller] add product', productId, orderId);
    let order: Order;

    try {
      order = this.repository.addItemToOrder(orderId, productId, count);
    } catch (e: any) {
      return {
        message: e,
        failure: true
      }
    }

    return {
      message: `added product ${productId} to order ${orderId}`,
      failure: false,
      data: {
        order
      }
    };
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

  public getOrderByIndex(index: number): OrdersControllerResponse {
    let order: Order;

    try {
      order = this.repository.fetchOrderByNumber(index);
    } catch (e: any) {
      return {
        message: e,
        failure: true
      }
    }

    return {
      message: `found index: ${index}`,
      failure: false,
      data: {
        order
      }
    }
  }


  /**
   * Use an order's unique ID to retrieve its record
   *
   * @error 
   * @returns OrdersControllerResponse order record returned as data
   */
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


  /**
   * Inserts an empty order in our records.
   *
   * Before we start tracking an order, the service records
   * an empty placeholder object with a unique identifier.
   *
   * @error if the service can't write a new placeholder
   * @data order id
   * @returns OrdersControllerResponse
   */
  public startNewOrder(): OrdersControllerResponse {
    let order: Order;

    try {
      order = this.repository.startNewOrder();  
    } catch (e: any) {
      return {
        message: e,
        failure: true
      }
    }

    return {
      message: `started a new order: ${order.id}`,
      failure: false,
      data: {
        order
      }
    }


  }

  private seed(orders: Order[]): void {
    this.repository.insertOrders(orders);
  }

  public static newUnhealthyOrdersController(): OrdersController {
    return new OrdersController(UnhealthyOrdersRepo);
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
