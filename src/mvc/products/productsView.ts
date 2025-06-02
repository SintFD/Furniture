import type { Product } from "../../types/index";
import LocalStorage from "../../utils/storage";

export default class ProductsView {
  private productsList: HTMLUListElement;
  private productsButton: HTMLButtonElement;

  constructor() {
    this.productsList = document.querySelector(".products__list")!;
    this.productsButton = document.querySelector(".products_button")!;
  }

  async renderProductsCards(loadProducts: Function, skip: number = 0) {
    const { products } = await loadProducts(16, skip);

    products.forEach((product: Product) => {
      const productCard = document.createElement("li");
      productCard.classList.add("product-card");

      const discount = document.createElement("div");
      discount.classList.add("product-card__discount");
      discount.textContent = `-${Math.floor(product.discountPercentage)}%`;

      const img = document.createElement("img");
      img.src = product.thumbnail;

      const container = document.createElement("div");
      container.classList.add("product-card__container");
      container.innerHTML = `
        <h3>${product.title}</h3>
        <p>Category: ${product.category}</p>
        <h4>$${product.price}</h4>
      `;

      const overlay = document.createElement("div");
      overlay.classList.add("product-card__overlay");

      const addCartBtn = document.createElement("button");
      addCartBtn.classList.add("product-card__add-cart-btn");
      addCartBtn.textContent = "Add to cart";

      const actions = document.createElement("div");
      actions.classList.add("product-card__actions");

      const shareBtn = document.createElement("button");
      shareBtn.classList.add("product-card__action-btn");
      shareBtn.innerHTML = `
        <img src="./src/assets/images/action-share.png" />
        Share
      `;

      const compareBtn = document.createElement("button");
      compareBtn.classList.add("product-card__action-btn");
      compareBtn.innerHTML = `
        <img src="./src/assets/images/action-change.png" />
        Compare
      `;

      const favoriteBtn = document.createElement("button");
      favoriteBtn.classList.add("product-card__action-btn", "action-favorite");
      favoriteBtn.innerHTML = `
        <img src="./src/assets/images/action-favorite.png" />
        Like
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

      actions.append(shareBtn, compareBtn, favoriteBtn);
      overlay.append(addCartBtn, actions);
      productCard.append(discount, img, container, overlay);
      this.productsList.append(productCard);
    });
  }
}
