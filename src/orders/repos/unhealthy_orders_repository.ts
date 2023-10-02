import Order from "../types/order";
import OrdersRepo from "./orders_repository_i";

class UnhealthyOrdersRepo implements OrdersRepo {
  private constructor() {}

  insertOrders(_orders: Order[]): void {
    throw new Error('Service Unavailable');    
  }

  fetchOrderById(_id: string): Order {
    throw new Error('Service Unavailable');    
  }

  fetchOrderByNumber(_idx: number): Order {
    throw new Error('Service Unavailable');    
  }

  paginatedFetchOrders(_page: number, _size: number): Order[] {
    throw new Error('Service Unavailable');    
  }

  startNewOrder(): Order {
    throw new Error('Service Unavailable');    
  }

  updateOrder(_: Order): void {
    throw new Error('Service Unavailable');
  }

  public static newUnhealthyOrdersRepo(): UnhealthyOrdersRepo {
    return new UnhealthyOrdersRepo();
  }
};

const repo = UnhealthyOrdersRepo.newUnhealthyOrdersRepo();

export default repo;
