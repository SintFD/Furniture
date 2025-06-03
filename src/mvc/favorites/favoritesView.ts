import type { Product } from "../../types";

export default class FavoritesView {
  static renderEmpty(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<p>В избранном пусто.</p>`;
  }
  static showToast(message: string) {
    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.textContent = message;

    const existing = document.querySelector(".custom-toast");
    if (existing) existing.remove();

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 2000);
  }
  static renderProducts(products: Product[], containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = products
      .map(
        (p) => `
      <div class="cart-item" data-id="${p.id}">
        <div class="product-info">
          <img class="cart-image" src="${p.thumbnail}" alt="${p.title}" />
          <span class="productname">${p.title}</span>
        </div>
        <div class="product-price">${p.price}$</div>
        <div class="product-actions">
          <div class="like-btn" title="Удалить из избранного">
            <img src="./src/assets/images/favorites-icon.png" alt="Like" />
          </div>
        </div>
        <button class="add-btn">Add To Cart</button>
      </div>
    `
      )
      .join("");
  }

  static showModal(product: Product) {
    const modalHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" id="modal-close">&times;</button>
          <img class="modal-image" src="${product.thumbnail}" alt="${
      product.title
    }" />
          <h2>${product.title}</h2>
          <p class="modal-price">${product.price}$</p>
          <p class="modal-description">${product.description || ""}</p>
        </div>
      </div>
    `;

    const existingModal = document.getElementById("modal-overlay");
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    document.getElementById("modal-close")?.addEventListener("click", () => {
      document.getElementById("modal-overlay")?.remove();
    });

    document.getElementById("modal-overlay")?.addEventListener("click", (e) => {
      if (e.target === document.getElementById("modal-overlay")) {
        document.getElementById("modal-overlay")?.remove();
      }
    });
  }
}
