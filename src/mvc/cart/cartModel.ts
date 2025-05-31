import type { Product } from "../../types";

export default class CartModel {
  private storageKey = "localCartArr";

  private getRawCart(): number[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveRawCart(arr: number[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(arr));
  }

  getCartItems(): { id: number; quantity: number }[] {
    const arr = this.getRawCart();
    const counts: Record<number, number> = {};
    arr.forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });

    return Object.entries(counts).map(([id, quantity]) => ({
      id: Number(id),
      quantity,
    }));
  }

  addProduct(id: number) {
    const arr = this.getRawCart();
    arr.push(id);
    this.saveRawCart(arr);
  }
  removeProduct(id: number) {
    const arr = this.getRawCart();
    const filtered = arr.filter((itemId) => itemId !== id);
    this.saveRawCart(filtered);
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity < 1) return;

    const arr = this.getRawCart().filter((itemId) => itemId !== id);
    for (let i = 0; i < quantity; i++) {
      arr.push(id);
    }
    this.saveRawCart(arr);
  }

  clearCart() {
    localStorage.removeItem(this.storageKey);
  }

  async fetchProducts(): Promise<Product[]> {
    const cartItems = this.getCartItems();
    const promises = cartItems.map(async (cartItem) => {
      const response = await fetch(
        `https://dummyjson.com/products/${cartItem.id}`
      );
      const data = await response.json();
      return {
        id: data.id,
        title: data.title,
        price: data.price,
        thumbnail: data.thumbnail,
        quantity: cartItem.quantity,
      };
    });
    return Promise.all(promises);
  }
}
