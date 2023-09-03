import OrdersController from "../../src/orders/orders_controller"
import Order from "../../src/orders/types/order";
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

describe("orders controller getOrders", () => {
  it("returns orders successfully", () => {
    const ordersResponse = ordersController.getOrders(1, 11);

    expect(ordersResponse.failure).toBeFalsy();

    expect(ordersResponse.data!.orders.length).toEqual(mockOrders.length);
  });

  it("returns empty if we page past the bounds", () => {
    const ordersResponse = ordersController.getOrders(2, 11);

    expect(ordersResponse.failure).toBeFalsy();

    expect(ordersResponse.data!.orders.length).toEqual(0);
  });

  it("returns a failure if we page to a negative index", () => {
    const ordersResponse = ordersController.getOrders(-1, 10);

    expect(ordersResponse.failure).toBeTruthy();

    expect(ordersResponse.data).toBeUndefined();
  });
});
