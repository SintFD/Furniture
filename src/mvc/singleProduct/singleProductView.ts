// src/mvc/singleProduct/singleProductView.ts

import type { Product } from "../../types/index";
import LocalStorage from "../../utils/storage";

export default class SingleProductView {
  private mainImage: HTMLImageElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private descElement: HTMLElement;
  private decrementBtn: HTMLButtonElement;
  private incrementBtn: HTMLButtonElement;
  private quantitySpan: HTMLElement;
  private addBtn: HTMLButtonElement;
  private favBtn: HTMLButtonElement;
  private skuElement: HTMLElement;
  private discountElement: HTMLElement | null;
  private tabButtons: NodeListOf<HTMLLIElement>;
  private descParagraphs: NodeListOf<HTMLParagraphElement>;
  private relatedList: HTMLUListElement;
  private showMoreBtn: HTMLButtonElement;

  constructor() {
    // Элементы для основного товара
    this.mainImage = document.querySelector(".main-product-image")!;
    this.titleElement = document.querySelector(".asgaard-h1")!;
    this.priceElement = document.querySelector(".price")!;
    this.descElement = document.querySelector(".desc")!;

    this.decrementBtn = document.querySelector(".decrement")!;
    this.incrementBtn = document.querySelector(".increment")!;
    this.quantitySpan = document.getElementById("quantity")!;

    this.addBtn = document.querySelector(".add-btn")!;
    this.favBtn = document.querySelector(".compare-btn")!;

    this.skuElement = document.querySelector(
      ".product-details-row:nth-child(1) span"
    )!;

    this.discountElement = document.querySelector(
      ".product-details-row:nth-child(2) span"
    );

    this.tabButtons = document.querySelectorAll(".section-navigation li");
    this.descParagraphs = document.querySelectorAll(
      ".infromation-description p"
    );

    this.relatedList = document.querySelector(".related-list")!;
    this.showMoreBtn = document.querySelector(".show-btn")!;
  }

  render(product: Product) {
    this.mainImage.src = product.thumbnail;
    this.mainImage.alt = product.title;
    this.titleElement.textContent = product.title;
    this.priceElement.textContent = `$${product.price}`;
    this.descElement.textContent = product.description || "";

    this.skuElement.textContent = `SS${product.id.toString().padStart(3, "0")}`;

    if (this.discountElement) {
      this.discountElement.textContent = product.discountPercentage
        ? `-${Math.floor(product.discountPercentage)}%`
        : "—";
    }

    this.quantitySpan.textContent = "1";

    this.setupTabs();
  }

  bindQuantityControls() {
    let qty = 1;
    this.incrementBtn.addEventListener("click", () => {
      qty++;
      this.quantitySpan.textContent = qty.toString();
    });
    this.decrementBtn.addEventListener("click", () => {
      if (qty > 1) {
        qty--;
        this.quantitySpan.textContent = qty.toString();
      }
    });
  }

  bindCartAndFavorites(product: Product) {
    this.addBtn.addEventListener("click", () => {
      const qty = Number(this.quantitySpan.textContent);
      for (let i = 0; i < qty; i++) {
        LocalStorage.setLocalArr("localCartArr", product.id);
      }
      alert(`Добавлено ${qty} шт. "${product.title}" в корзину`);
    });

    this.favBtn.addEventListener("click", () => {
      LocalStorage.setLocalArr("localFavoritesArr", product.id);
      alert(`"${product.title}" добавлен в избранное`);
    });
  }

  private setupTabs() {
    this.descParagraphs.forEach((p, idx) => {
      p.style.display = idx === 0 ? "block" : "none";
    });

    this.tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.tabButtons.forEach((b) =>
          b.classList.remove("active-navigation-item")
        );
        btn.classList.add("active-navigation-item");

        const index = Array.from(this.tabButtons).indexOf(btn);
        this.descParagraphs.forEach((p, idx) => {
          p.style.display = idx === index ? "block" : "none";
        });
      });
    });
  }

  /**
   * @param products Массив из четырёх объектов Product
   * @param loadProducts Функция для подгрузки следующих (если нужна логика «Show More»)
   */
  renderRelatedProducts(
    products: Product[],
    loadProducts?: (
      limit: number,
      skip: number
    ) => Promise<{ products: Product[] }>
  ) {
    this.relatedList.innerHTML = "";

    products.forEach((product) => {
      const productCard = document.createElement("li");
      const actions = document.createElement("div");
      const overlay = document.createElement("div");
      const favoriteBtn = document.createElement("button");
      const addCartBtn = document.createElement("button");

      overlay.classList.add("product-card__overlay");

      actions.classList.add("product-card__actions");
      actions.innerHTML = `
      <button class="product-card__action-btn action-share">
        <img src="./src/assets/images/action-share.png" alt="Share" />
        Share
      </button>
      <button class="product-card__action-btn action-compare">
        <img src="./src/assets/images/action-change.png" alt="Compare" />
        Compare
      </button>
    `;

      favoriteBtn.classList.add("product-card__action-btn", "action-favorite");
      favoriteBtn.innerHTML = `
      <img src="./src/assets/images/action-favorite.png" alt="Like" /> Like
    `;

      addCartBtn.classList.add(
        "product-card__add-cart-btn",
        "btn",
        "btn--primary"
      );
      addCartBtn.textContent = "Add to cart";

      productCard.classList.add("product-card", "related-product-card");
      productCard.innerHTML = `
      <div class="product-card__discount badge badge--discount">-${Math.floor(
        product.discountPercentage || 0
      )}%</div>
      <img class="product-card__image" src="${product.thumbnail}" alt="${
        product.title
      }">
      <div class="product-card__container">
        <h3 class="product-card__title">${product.title}</h3>
        <h4 class="product-card__price">${product.price}$</h4>
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
      this.relatedList.append(productCard);
    });

    if (loadProducts) {
      this.showMoreBtn.addEventListener(
        "click",
        async () => {
          const skip = this.relatedList.children.length;
          const { products: more } = await loadProducts(4, skip);
          this.renderRelatedProducts(more, loadProducts);
        },
        { once: true }
      );
    } else {
      this.showMoreBtn.style.display = "none";
    }
  }
}
