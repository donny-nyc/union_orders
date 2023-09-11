import Order from "../types/order";
import OrdersRepo from "./orders_repository_i";

class UnhealthyOrdersRepo implements OrdersRepo {
  private constructor() {}

  insertOrders(orders: Order[]): void {
    throw new Error('Service Unavailable');    
  }

  fetchOrderById(id: string): Order {
    throw new Error('Service Unavailable');    
  }

  fetchOrderByNumber(idx: number): Order {
    throw new Error('Service Unavailable');    
  }

  paginatedFetchOrders(page: number, size: number): Order[] {
    throw new Error('Service Unavailable');    
  }

  startNewOrder(): Order {
    throw new Error('Service Unavailable');    
  }

  addItemToOrder(orderId: string, productId: string, count: number): Order {
    throw new Error('Service Unavailable');    
  }

  removeItemFromOrder(orderId: string, productId: string): void {
    throw new Error('Service Unavailable');    
  }

  updateOrderItemCount(orderId: string, productId: string, count: number): void {
    throw new Error('Service Unavailable');    
  }

  public static newUnhealthyOrdersRepo(): UnhealthyOrdersRepo {
    return new UnhealthyOrdersRepo();
  }
};

const repo = UnhealthyOrdersRepo.newUnhealthyOrdersRepo();

export default repo;
