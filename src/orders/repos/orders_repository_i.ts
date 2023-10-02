import Order from "../types/order";

export default interface OrdersRepo {
  insertOrders(orders: Order[]): void;
  fetchOrderById(id: string): Order;
  fetchOrderByNumber(idx: number): Order;
  paginatedFetchOrders(page: number, size: number): Order[];
  startNewOrder(): Order;
  updateOrder(order: Order): void;
};
