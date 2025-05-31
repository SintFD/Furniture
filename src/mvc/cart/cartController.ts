import { ProductService } from "../../service/products";
import { CartModel } from "./cartModel";
import { CartView } from "./cartView";

export class CartController {
  private cartModel = new CartModel();
  private cartView = new CartView();
  private productService = new ProductService();

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    const items = this.cartModel.getItems();
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const product = await this.productService.getProductById(item.id);
        return { ...product, quantity: item.quantity };
      })
    );
    this.cartModel = new CartModel();
    detailedItems.forEach((item) => this.cartModel.addItem(item));
    this.cartView.renderCartItems(this.cartModel.getItems());
    this.cartView.updateTotals(this.cartModel.getTotal());
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    document
      .getElementById("cart-items")!
      .addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const itemDiv = target.closest(".cart-item") as HTMLElement;
        if (!itemDiv) return;
        const productId = parseInt(itemDiv.dataset.id!);

        if (target.classList.contains("remove-btn")) {
          this.cartModel.removeItem(productId);
          this.cartView.renderCartItems(this.cartModel.getItems());
          this.cartView.updateTotals(this.cartModel.getTotal());
        }
      });

    document
      .getElementById("cart-items")!
      .addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        if (target.classList.contains("quantity-input")) {
          const itemDiv = target.closest(".cart-item") as HTMLElement;
          const productId = parseInt(itemDiv.dataset.id!);
          const quantity = parseInt(target.value);
          this.cartModel.updateQuantity(productId, quantity);
          this.cartView.renderCartItems(this.cartModel.getItems());
          this.cartView.updateTotals(this.cartModel.getTotal());
        }
      });
  }
}
