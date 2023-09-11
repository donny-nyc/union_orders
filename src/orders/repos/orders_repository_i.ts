import Order from "../types/order";

export default interface OrdersRepo {
  insertOrders(orders: Order[]): void;
  fetchOrderById(id: string): Order;
  fetchOrderByNumber(idx: number): Order;
  paginatedFetchOrders(page: number, size: number): Order[];
  startNewOrder(): Order;
  addItemToOrder(
    orderId: string, 
    productId: string, 
    count: number): Order;
  removeItemFromOrder(orderId: string, productId: string): void;
  updateOrderItemCount(
    orderId: string, 
    productId: string, 
    count: number): void;
};
