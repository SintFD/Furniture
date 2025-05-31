import type { Product } from "../../types";

export class CartView {
  private cartItemsContainer = document.getElementById("cart-items")!;
  private subtotalAmount = document.querySelector(".subtotal-amount")!;
  private totalAmount = document.querySelector(".total-amount")!;

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
          product.price * product.quantity
        ).toFixed(2)}$</div>
        <button class="remove-btn">🗑️</button>
      `;
      this.cartItemsContainer.appendChild(itemDiv);
    });
  }

  updateTotals(total: number): void {
    this.subtotalAmount.textContent = `Rs. ${total.toFixed(2)}`;
    this.totalAmount.textContent = `Rs. ${total.toFixed(2)}`;
  }
}

const modal = document.getElementById("success-modal") as HTMLElement;
const closeButton = document.querySelector(".close-button") as HTMLElement;
document.querySelector(".checkout-btn")?.addEventListener("click", () => {
  modal.style.display = "block";
});
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
