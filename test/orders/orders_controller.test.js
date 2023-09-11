"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_controller_1 = __importDefault(require("../../src/orders/orders_controller"));
const order_1 = __importDefault(require("../../src/orders/types/order"));
const order_item_1 = __importDefault(require("../../src/orders/types/order_item"));
const randomId = (max = 10000) => {
    return Math.floor(Math.random() * max);
};
const mockProducts = () => {
    const products = new Map();
    const productCount = randomId(10);
    for (let i = 0; i < productCount; i++) {
        const itemId = randomId(10000).toString();
        const item = order_item_1.default.builder().setCount(randomId(100)).setProductId(itemId).build();
        products.set(itemId, item);
    }
    return products;
};
const mockOrders = [
    new order_1.default(randomId().toString(), 0, mockProducts()),
    new order_1.default(randomId().toString(), 1, mockProducts()),
    new order_1.default(randomId().toString(), 2, mockProducts()),
    new order_1.default(randomId().toString(), 3, mockProducts()),
    new order_1.default(randomId().toString(), 4, mockProducts()),
    new order_1.default(randomId().toString(), 5, mockProducts()),
    new order_1.default(randomId().toString(), 6, mockProducts()),
    new order_1.default(randomId().toString(), 7, mockProducts()),
    new order_1.default(randomId().toString(), 8, mockProducts()),
    new order_1.default(randomId().toString(), 9, mockProducts()),
    new order_1.default(randomId().toString(), 10, mockProducts()),
];
const ordersController = orders_controller_1.default.newDummyOrdersController(mockOrders);
const unhealthyOrdersController = orders_controller_1.default.newUnhealthyOrdersController();
describe("orders controller getOrders", () => {
    it("returns orders successfully", () => {
        const ordersResponse = ordersController.getOrders(1, 11);
        expect(ordersResponse.failure).toBeFalsy();
        expect(ordersResponse.data.orders.length).toEqual(mockOrders.length);
    });
    it("returns empty if we page past the bounds", () => {
        const ordersResponse = ordersController.getOrders(2, 11);
        expect(ordersResponse.failure).toBeFalsy();
        expect(ordersResponse.data.orders.length).toEqual(0);
    });
    it("returns a failure if we page to a negative index", () => {
        const ordersResponse = ordersController.getOrders(-1, 10);
        expect(ordersResponse.failure).toBeTruthy();
        expect(ordersResponse.data).toBeUndefined();
    });
    it("handles a service error gracefully", () => {
        const ordersResponse = unhealthyOrdersController.getOrders();
        expect(ordersResponse.failure).toBeTruthy();
        expect(ordersResponse.message).toEqual(new Error("Service Unavailable"));
    });
});
describe("starting a new order", () => {
    it("can create a new order", () => {
        const orderResponse = ordersController.startNewOrder();
        expect(orderResponse.failure).toBeFalsy();
        expect(orderResponse.data.order).not.toBeUndefined();
        const orderId = orderResponse.data.order.id;
        const searchResponse = ordersController.getOrderById(orderId);
        expect(searchResponse.failure).toBeFalsy();
        expect(searchResponse.data.order).not.toBeUndefined();
    });
    it("handles service errors gracefully", () => {
        const orderResponse = unhealthyOrdersController.startNewOrder();
        expect(orderResponse.failure).toBeTruthy();
        expect(orderResponse.message).toEqual(new Error("Service Unavailable"));
    });
});
describe("fetching an order by its id", () => {
    it("fails if the ID isn't recognized", () => {
        const orderResponse = ordersController.getOrderById("UNRECOGNIZED_ID");
        expect(orderResponse.failure).toBeTruthy();
        expect(orderResponse.message).toEqual(new Error("Order UNRECOGNIZED_ID not found"));
    });
    it("handles service errors gracefully", () => {
        const orderResponse = unhealthyOrdersController.getOrderById("ORDER_ID");
        expect(orderResponse.failure).toBeTruthy();
        expect(orderResponse.message).toEqual(new Error("Service Unavailable"));
    });
});
describe("fetching an order by its index", () => {
    it("fails if the index isn't recognized", () => {
        const orderResponse = ordersController.getOrderByIndex(100);
        expect(orderResponse.failure).toBeTruthy();
        expect(orderResponse.message).toEqual(new Error("Index 100 is out of bounds"));
    });
    it("fails if the index is not positive", () => {
        const orderResponse = ordersController.getOrderByIndex(-1);
        expect(orderResponse.failure).toBeTruthy();
        expect(orderResponse.message).toEqual(new Error("Index must be positive: -1"));
    });
    it("handles service errors gracefully", () => {
        const orderResponse = unhealthyOrdersController.getOrderByIndex(0);
        expect(orderResponse.failure).toBeTruthy();
        expect(orderResponse.message).toEqual(new Error("Service Unavailable"));
    });
});
