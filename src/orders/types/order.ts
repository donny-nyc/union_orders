import OrderItem from "./order_item";

export enum OrderStatus {
  OPEN = "OPEN",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING"
};

export default class Order {
  public readonly id: string;
  public readonly index: number;
  private status: OrderStatus = OrderStatus.OPEN;

  public readonly products: Map<string, OrderItem> = new Map<string, OrderItem>();

  constructor(id: string, index: number, products?: Map<string, OrderItem>) {
    this.id = id;
    this.index = index;

    if (products) {
      this.products = products
    }
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public cancel(): void {
    this.status = OrderStatus.CANCELLED;
  }

  public makePending(): void {
    this.status = OrderStatus.PENDING;
  }

  public reopen(): void {
    this.status = OrderStatus.OPEN;
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
