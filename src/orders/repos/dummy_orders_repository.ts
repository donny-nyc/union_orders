import Order from '../types/order';
import OrdersRepo from './orders_repository_i';

class DummyOrdersRepo implements OrdersRepo {
  private orders: Map<string, Order> = new Map<string, Order>();

  private constructor() {}

  public fetchOrderById(id: string): Order {
    if(!this.orders.has(id)) {
      console.error(this.orders.keys());
      throw new Error(`Order ${id} not found`);
    }

    const order = this.orders.get(id) as Order;

    return order;
  }

  insertOrders(orders: Order[]): void {
    for (const order of orders) {
      this.orders.set(order.id, order);
    }
  }

  public paginatedFetchOrders(page: number, size: number): Order[] {
    const orderEntries: Order[]  = Array.from(this.orders.entries()).slice((page-1) * size, page * size)
      .map(pair => {
        return pair[1];
      });

    return orderEntries;
  }

  public fetchOrderByNumber(idx: number): Order {
    if (idx >= this.orders.size) {
      throw new Error(`Index ${idx} is out of bounds`);
    }

    if (idx < 0) {
      throw new Error(`Index must be positive: ${idx}`);
    }

    const key = Array.from(this.orders.keys())[idx];

    return this.orders.get(key) as Order;
  }

  public startNewOrder(): Order {
    const id: string = Math.floor(Math.random() * 10000).toString();
    const idx: number = this.orders.size;

    const order = new Order(id, idx);

    this.orders.set(id, order);

    return order;
  }

  public addItemToOrder(orderId: string, productId: string, count: number): Order {
    const order = this.fetchOrderById(orderId);

    order.addItem(productId, count);

    return order;
  }

  public removeItemFromOrder(orderId: string, productId: string): void {
    const order = this.fetchOrderById(orderId);

    order.removeItem(productId);
  }

  public updateOrderItemCount(orderId: string, productId: string, count: number): void {
    const order = this.fetchOrderById(orderId);

    order.addItem(productId, count);
  }

  public updateOrder(order: Order): void {
    const orderId: string = order.id;

    this.orders.set(orderId, order);
  }

  public static newDummyOrdersRepo(): DummyOrdersRepo {
    return new DummyOrdersRepo();
  }
};

const repo = DummyOrdersRepo.newDummyOrdersRepo();

export default repo;
