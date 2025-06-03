import { ProductAPIService } from "../../service/products";
import type CartModel from "./cartModel";
import type CartView from "./cartView";

export default class CartController {
  private model: CartModel;
  private view: CartView;
  constructor(model: CartModel, view: CartView) {
    this.model = model;
    this.view = view;
  }

  public async init() {
    await this.render();

    this.view.bindRemoveProduct(this.handleRemoveProduct.bind(this));
    this.view.bindQuantityChange(this.handleQuantityChange.bind(this));
    this.view.bindCheckout(this.handleCheckout.bind(this));
    this.view.bindCloseModal();
    this.view.bindImageClick(this.handleImageClick.bind(this));
  }

  private async render() {
    const products = await this.model.fetchProducts();
    this.view.renderCartItems(products);
    const subtotal = products.reduce(
      (sum, p) => sum + p.price * p.quantity!,
      0
    );
    this.view.updateTotals(subtotal, subtotal);
  }

  private handleRemoveProduct(id: number) {
    this.model.removeProduct(id);
    this.render();
  }

  private handleQuantityChange(id: number, quantity: number) {
    this.model.updateQuantity(id, quantity);
    this.render();
  }
  private async handleImageClick(id: number) {
    const service = new ProductAPIService();
    const product = await service.getProductById(id);
    this.view.showProductModal(product);
  }
  private handleCheckout() {
    this.view.showSuccessModal();
    this.model.clearCart();
    this.render();
  }
}
