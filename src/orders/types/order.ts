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

  public readonly items: Map<string, OrderItem> = new Map<string, OrderItem>();

  constructor(id: string, index: number, items?: Map<string, OrderItem>) {
    this.id = id;
    this.index = index;

    if (items) {
      this.items = items
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
    if (this.items.has(productId)) {
      this.items.get(productId)?.increment(count);

      return
    }

    const item: OrderItem = OrderItem.builder()
      .setCount(count)
      .setProductId(productId)
      .build();

    this.items.set(productId, item);
  }

  public incrementItem(productId: string) {
    if (!this.items.has(productId)) {
      console.error('[increment] item not found', productId);
      return;
    }

    this.items.get(productId)?.increment();
  }

  public decrementItem(productId: string) {
    if (!this.items.has(productId)) {
      console.error('[decrement] item not found', productId);
      return;
    }

    this.items.get(productId)?.decrement();
  }

  public json() {
    const items: Record<string, OrderItem> = {};

    for (const key of this.items.keys()) {
      items[key] = this.items.get(key) as OrderItem;
    }

    return {
      id: this.id,
      index: this.index,
      status: this.status,
      items
    }
  }

  public removeItem(productId: string) {
    if (!this.items.has(productId)) {
      throw new Error(`Product ${productId} not found`);
    }

    this.items.delete(productId);
  }
};
