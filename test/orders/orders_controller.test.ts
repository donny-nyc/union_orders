import OrdersController from "../../src/orders/orders_controller"
import Order, {OrderStatus} from "../../src/orders/types/order";
import OrderItem from "../../src/orders/types/order_item";

const randomId = (max: number = 10000): number => {
  return Math.floor(Math.random() * max);
};

const mockProducts = (): Map<string, OrderItem>  => {
  const products = new Map<string, OrderItem>();

  const productCount = randomId(10); 

  for (let i = 0; i < productCount; i++) {
    const itemId = randomId(10000).toString();
    const item: OrderItem = OrderItem.builder().setCount(randomId(100)).setProductId(itemId).build();

    products.set(itemId, item);    
  }

  return products;
};

const mockOrders: Order[] = [
  new Order(randomId().toString(), 0, mockProducts()),
  new Order(randomId().toString(), 1, mockProducts()),
  new Order(randomId().toString(), 2, mockProducts()),
  new Order(randomId().toString(), 3, mockProducts()),
  new Order(randomId().toString(), 4, mockProducts()),
  new Order(randomId().toString(), 5, mockProducts()),
  new Order(randomId().toString(), 6, mockProducts()),
  new Order(randomId().toString(), 7, mockProducts()),
  new Order(randomId().toString(), 8, mockProducts()),
  new Order(randomId().toString(), 9, mockProducts()),
  new Order(randomId().toString(), 10, mockProducts()),
];

const ordersController = OrdersController.newDummyOrdersController(mockOrders);

const unhealthyOrdersController = OrdersController.newUnhealthyOrdersController();

describe("orders controller getOrders", () => {
  it("returns orders successfully", () => {
    const ordersResponse: Order[] 
      = ordersController.getOrders(1, 11) as Order[];

    expect(ordersResponse).not.toBeUndefined();

    expect(ordersResponse instanceof Array).toBeTruthy();

    expect(ordersResponse.length).toEqual(mockOrders.length);
  });

  it("returns empty if we page past the bounds", () => {
    const ordersResponse = ordersController.getOrders(2, 11);

    expect(ordersResponse).toEqual([]);
  });

  it("returns a failure if we page to a negative index", () => {
    const ordersResponse = ordersController.getOrders(-1, 10);

    expect(ordersResponse).toBeUndefined();
  });

  it("handles a service error gracefully", () => {
    const ordersResponse = unhealthyOrdersController.getOrders();

    expect(ordersResponse).toBeUndefined();
  });
});

describe("starting a new order", () => {
  it("can create a new order", () => {
    const orderResponse: Order 
      = ordersController.startNewOrder() as Order;

    expect(orderResponse).not.toBeUndefined();

    const orderId = orderResponse.id;

    const searchResponse = ordersController.getOrderById(orderId);

    expect(searchResponse).not.toBeUndefined();
  });

  it("handles service errors gracefully", () => {
    const orderResponse = unhealthyOrdersController.startNewOrder();

    expect(orderResponse).toBeUndefined();
  });
});

describe("fetching an order by its id", () => {
  it("fails if the ID isn't recognized", () => {
    const orderResponse = ordersController.getOrderById("UNRECOGNIZED_ID");

    expect(orderResponse).toBeUndefined();
  });
});

describe("fetching an order by its index", () => {
  it("returns null if the index isn't recognized", () => {
    const orderResponse = ordersController.getOrderByIndex(100);

    expect(orderResponse).toBeUndefined();
  });

  it("returns null if the index is not positive", () => {
    const orderResponse = ordersController.getOrderByIndex(-1);

    expect(orderResponse).toBeUndefined();
  });
});

describe("cancelling an order", () => {
  it("marks the given order as 'CANCELLED'", () => {
    const orderResponse: Order 
      = ordersController.startNewOrder() as Order;

    const orderId = orderResponse.id;

    ordersController.cancelOrder(orderId);

    const cancelledOrder 
      = ordersController.getOrderById(orderId) as Order;

    expect(cancelledOrder.getStatus()).toEqual(OrderStatus.CANCELLED);
  });

  it("returns Undefined if the order cannot be found", () => {
    const cancelledResponse = ordersController.cancelOrder("CANCEL_ORDER");

    expect(cancelledResponse).toBeUndefined();
  });
});
