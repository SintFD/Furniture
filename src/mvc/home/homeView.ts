import type { Product } from "../../types/index";

import LocalStorage from "../../utils/storage";

export default class HomeController {
  private productsList: HTMLUListElement;
  private productsButton: HTMLButtonElement;

  constructor() {
    this.productsList = document.querySelector(".products__list")!;
    this.productsButton = document.querySelector(".products_button")!;
  }

  async renderProductsCards(loadProducts: Function, skip: number = 0) {
    const { products } = await loadProducts(8, skip);
    products.forEach((product: Product) => {
      const favoriteBtn = document.createElement("button");
      const addCartBtn = document.createElement("button");
      const productCard = document.createElement("li");
      const actions = document.createElement("div");
      const overlay = document.createElement("div");

      overlay.classList.add("product-card__overlay");

      actions.classList.add("product-card__actions");
      actions.innerHTML = `
      <button class="product-card__action-btn">
        <img src="./src/assets/images/action-share.png" />
        Share
      </button>
      <button class="product-card__action-btn">
        <img src="./src/assets/images/action-change.png" />
        Compare
      </button>`;

      favoriteBtn.classList.add("product-card__action-btn");
      favoriteBtn.classList.add("action-favorite");
      favoriteBtn.innerHTML = `
      <img src="./src/assets/images/action-favorite.png" />
      Like`;

      addCartBtn.classList.add("product-card__add-cart-btn");
      addCartBtn.textContent = "Add to cart";

      productCard.classList.add("product-card");
      productCard.innerHTML = `<div class='product-card__discount'>-${Math.floor(
        product.discountPercentage
      )}%</div>
      <img src=${product.thumbnail}>
      <div class='product-card__container'>
      <h3>${product.title}</h3>
      <p>Category: ${product.category}</p>
      <h4>${product.price}$</h4>
      </div>
      `;

      productCard.addEventListener("click", () => {
        location.assign(`/product.html?id=${product.id}`);
      });

      addCartBtn.addEventListener("click", (e) => {
        LocalStorage.setLocalArr("localCartArr", product.id);
        e.stopPropagation();
      });

      favoriteBtn.addEventListener("click", (e) => {
        LocalStorage.setLocalArr("localFavoritesArr", product.id);
        e.stopPropagation();
      });

      overlay.append(addCartBtn);
      actions.append(favoriteBtn);
      overlay.append(actions);
      productCard.append(overlay);
      this.productsList.append(productCard);
    });

    this.productsButton.addEventListener(
      "click",
      async () => {
        skip = skip + 8;
        this.renderProductsCards(loadProducts, skip);
      },
      { once: true }
    );
  }
}
