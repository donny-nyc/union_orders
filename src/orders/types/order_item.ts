export default class OrderItem {
  private readonly productId_: string = "";
  private count_: number = 0;

  public constructor(id: string, count: number) {
    this.productId_ = id;
    this.count_ = count;
  }

  public increment(count: number = 1) {
    if (this.count_ <= 0) {
      throw new Error("count cannot be negative");
    } 

    this.count_ += count;
  };

  public setCount(count: number) {
    if (count < 0) {
      throw new Error("count cannot be negative");
    }

    this.count_ = count;
  }

  public decrement(count: number = 1) {
    if (this.count_ <= 0) {
      throw new Error("count cannot be negative");
    }

    this.count_ -= count;
  };

  public count() {
    return this.count_;
  }

  public productId() {
    return this.productId_;
  }

  public static builder() {
    return new OrderItemBuilder();
  }
};

class OrderItemBuilder {
  private productId_: string = "";
  private count_: number = 0;

  public setProductId(id: string): OrderItemBuilder {
    this.productId_ = id;

    return this;
  }

  public setCount(count: number): OrderItemBuilder {
    this.count_ = count;

    return this;
  }

  public build() {
    const orderItem = new OrderItem(this.productId_, this.count_);

    return orderItem;
  }
};


