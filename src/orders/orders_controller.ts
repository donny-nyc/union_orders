import OrdersRepo from "./repos/orders_repository_i";
import DummyOrdersRepo from './repos/dummy_orders_repository';
import UnhealthyOrdersRepo from './repos/unhealthy_orders_repository';
import Order from "./types/order";

class OrdersController {
  private repository: OrdersRepo;

  private constructor(repo: OrdersRepo) {
    this.repository = repo;
  }

  /**
   * Includes new items in an order
   *
   * and, increases the count for existing items
   *
   * @data orderId
   * @data productId
   * @data count
   * @error order not found
   * @error invalid count
   * @returns Order with the updated product list
   * @returns void
   */
  public addProductToOrder(
    orderId: string, 
    productId: string, 
    count: number
  ): Order | void {
    console.log('[Orders Controller] add product', productId, orderId);

    try {
      const order = this.repository.fetchOrderById(orderId);

      order.addItem(productId, count);

      console.log('[Orders Controller] item added to order', order);

      return order;
    } catch (e: any) {
      console.error('[Orders Controller] add item to order failed', e);
    }
  }

  public getOrders(
    page: number = 1, 
    size: number = 10
  ): Order[] | void {
    console.log(`getOrders, page: ${page}, size: ${size}`);

    if (page < 1 || size < 1) {
      console.error('arguments must be positive', page, size)
      return;
    }

    try {
      const orders: Order[] = 
        this.repository.paginatedFetchOrders(page, size);

      console.log('[Orders Controller] orders found', orders);

      return orders
    } catch (e: any) {
      console.error('failed to fetch orders', e)
    }
  }

  /**
   * Orders can be referenced by their rank
   * (first, second, third, and so on)
   *
   * @param index an integer value, zero or greater
   * @returns Order when the order is found
   * @returns void if no such order exists
   */
  public getOrderByIndex(index: number): Order | void {
    console.log(`[getOrderByIndex] index: ${index}`);

    let order: Order;

    try {
      order = this.repository.fetchOrderByNumber(index);

      console.log(`[getOrderByIndex] order found: ${order}`);

      return order;
    } catch (e: any) {
      console.error('failed to getOrderByIndex', e);
    }
  }


  /**
   * Use an order's unique ID to retrieve its record
   *
   * @error 
   * @returns Order when found
   * @returns void when no order is found with the given unique ID
   */
  public getOrderById(orderId: string): Order | void {
    console.log(`[getOrderById] id: ${orderId}`);

    try {
      const order: Order = this.repository.fetchOrderById(orderId);

      console.log(`[getOrderById] order found: ${order}`);

      return order;
    } catch (e: any) {
      console.error('[getOrderById] unable to get order', e);
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
   * @returns Order
   */
  public startNewOrder(): Order | void {
    console.log('[startNewOrder]');

    try {
      const order = this.repository.startNewOrder();  

      console.log(`[startNewOrder] order created: ${order}`);

      return order;
    } catch (e: any) {
      console.error('[startNewOrder] error: ', e);
    }
  }

  /**
   * Marks an existing, pending Order as CANCELLED
   *
   * @error if the Order cannot be found
   * @error if the Order exists, but is not PENDING
   * @data orderId unique identifier for the Order
   * @returns Order
   * @returns void if the update fails
   */
  public cancelOrder(orderId: string): Order | void {
    console.log(`[cancelOrder] orderId: ${orderId}`);

    try {
      const order = this.repository.fetchOrderById(orderId);

      order.cancel();

      this.repository.updateOrder(order);

      console.log(`[cancelOrder] success: ${order}`);

      return order;
    } catch (e: any) {
      console.error('[cancelOrder] error: ', e);
    }
  }

  /**
   * WARN: should not be used in Production environments
   */
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
