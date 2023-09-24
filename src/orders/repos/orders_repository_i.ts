import Order from "../types/order";

// Not sure I like this repetition
// Might be good for the repo to strictly focus
// on CRUD operations via the data store:
// get order, update order, create order, delete order
// and build out the use case in the controller
// on top of these simple actions
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
  updateOrder(order: Order): void;
  updateOrderItemCount(
    orderId: string, 
    productId: string, 
    count: number): void;
};
