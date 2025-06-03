import type { Product } from "../../types";

export default class CartView {
  private cartItemsContainer: HTMLElement;
  private subtotalAmount: HTMLElement;
  private totalAmount: HTMLElement;
  private checkoutBtn: HTMLElement;
  private successModal: HTMLElement;
  private closeModalBtn: HTMLElement;

  constructor() {
    this.cartItemsContainer = document.getElementById("cart-items")!;
    this.subtotalAmount = document.querySelector(".subtotal-amount")!;
    this.totalAmount = document.querySelector(".total-amount")!;
    this.checkoutBtn = document.querySelector(".checkout-btn")!;
    this.successModal = document.getElementById("success-modal")!;
    this.closeModalBtn = this.successModal.querySelector(".close-button")!;
  }

  renderCartItems(items: Product[]): void {
    this.cartItemsContainer.innerHTML = "";
    items.forEach((product) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.dataset.id = product.id.toString();
      itemDiv.innerHTML = `
        <div class="product-info">
          <img src="${product.thumbnail}" alt="${product.title}" />
          <span class="product-name">${product.title}</span>
        </div>
        <div class="product-price">${product.price}$</div>
        <div class="product-quantity">
          <input type="number" value="${
            product.quantity
          }" min="1" class="quantity-input" />
        </div>
        <div class="product-subtotal">${(
          product.price * product.quantity!
        ).toFixed(2)}$</div>
        <button class="remove-btn">🗑️</button>
      `;
      this.cartItemsContainer.appendChild(itemDiv);
    });
  }

  updateTotals(subtotal: number, total: number): void {
    this.subtotalAmount.textContent = ` ${subtotal.toFixed(2)}$`;
    this.totalAmount.textContent = ` ${total.toFixed(2)}$`;
  }

  bindRemoveProduct(handler: (id: number) => void) {
    this.cartItemsContainer.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("remove-btn")) {
        const itemDiv = target.closest(".cart-item");
        if (!itemDiv) return;

        const idStr = (itemDiv as HTMLElement).dataset?.id;
        if (!idStr) return;

        const id = Number(idStr);
        if (isNaN(id)) return;

        handler(id);
      }
    });
  }

  bindQuantityChange(handler: (id: number, quantity: number) => void) {
    this.cartItemsContainer.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains("quantity-input")) {
        const itemDiv = target.closest(".cart-item");
        if (!itemDiv) return;

        const idStr = (itemDiv as HTMLElement).dataset?.id;
        if (!idStr) return;

        const id = Number(idStr);
        if (isNaN(id)) return;

        const quantity = Number(target.value);
        if (isNaN(quantity) || quantity < 1) return;

        handler(id, quantity);
      }
    });
  }
  showProductModal(product: Product) {
    const modalHTML = `
    <div class="modal-overlay" id="cart-product-modal">
      <div class="modal-content">
        <button class="modal-close" id="modal-close">&times;</button>
        <img class="modal-image" src="${product.thumbnail}" alt="${
      product.title
    }" />
        <h2>${product.title}</h2>
        <p class="modal-price">${product.price}$</p>
        <p class="modal-description">${
          product.description || "Нет описания."
        }</p>
      </div>
    </div>
  `;

    const existing = document.getElementById("cart-product-modal");
    if (existing) existing.remove();

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    document.getElementById("modal-close")?.addEventListener("click", () => {
      document.getElementById("cart-product-modal")?.remove();
    });

    document
      .getElementById("cart-product-modal")
      ?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("cart-product-modal")) {
          document.getElementById("cart-product-modal")?.remove();
        }
      });
  }

  bindCheckout(handler: () => void) {
    this.checkoutBtn.addEventListener("click", handler);
  }

  showSuccessModal() {
    this.successModal.classList.add("show");
  }

  hideSuccessModal() {
    this.successModal.classList.remove("show");
  }
  bindImageClick(handler: (id: number) => void) {
    this.cartItemsContainer.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === "img") {
        const itemDiv = target.closest(".cart-item");
        if (!itemDiv) return;
        const idStr = itemDiv.getAttribute("data-id");
        if (!idStr) return;
        const id = Number(idStr);
        if (!isNaN(id)) handler(id);
      }
    });
  }

  bindCloseModal() {
    this.closeModalBtn.addEventListener("click", () => this.hideSuccessModal());
    this.successModal.addEventListener("click", (e) => {
      if (e.target === this.successModal) this.hideSuccessModal();
    });
  }
}
