import type { Product } from "../../types";

export class CartModel {
  private items: Product[] = [];

  constructor() {
    this.loadFromStorage();
  }

  addItem(product: Product): void {
    const existing = this.items.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      this.items.push(product);
    }
    this.saveToStorage();
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.items.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveToStorage();
    }
  }

  getItems(): Product[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  private saveToStorage(): void {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  private loadFromStorage(): void {
    const data = localStorage.getItem("cart");
    if (data) {
      this.items = JSON.parse(data);
    }
  }
}
