import OrderItem from "./order_item";

export default class Order {
  public readonly id: string;
  public readonly index: number;

  public readonly products: Map<string, OrderItem> = new Map<string, OrderItem>();

  constructor(id: string, index: number, products?: Map<string, OrderItem>) {
    this.id = id;
    this.index = index;

    if (products) {
      this.products = products
    }
  }

  public addItem(productId: string, count: number) {
    if (this.products.has(productId)) {
      this.products.get(productId)?.increment(count);

      return
    }

    const item: OrderItem = OrderItem.builder()
      .setCount(count)
      .setProductId(productId)
      .build();

    this.products.set(productId, item);
  }

  public removeItem(productId: string) {
    if (!this.products.has(productId)) {
      throw new Error(`Product ${productId} not found`);
    }

    this.products.delete(productId);
  }
};
