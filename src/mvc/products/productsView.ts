import type { Product } from "../../types/index";
import LocalStorage from "../../utils/storage";

export default class ProductsView {
  private productsList: HTMLUListElement;
  private sortBtn: HTMLSelectElement;
  private filterSelect: HTMLSelectElement;
  public itemsPerPageSelect: HTMLSelectElement;
  private pageBtnsContainer: HTMLDivElement;
  private filterBarInfo: HTMLParagraphElement;

  constructor() {
    this.productsList = document.querySelector(".products__list")!;
    this.sortBtn = document.querySelector("#sort-by")!;
    this.filterSelect = document.querySelector(
      ".filter-bar__container select"
    )!;
    this.itemsPerPageSelect = document.querySelector("#items-per-page")!;
    this.pageBtnsContainer = document.querySelector(".products__page-btns")!;
    this.filterBarInfo = document.querySelector(".filter-bar__info")!;
  }

  async renderProductsCards(
    loadProducts: Function,
    lim: number = 16,
    skip: number = 0,
    sort: string = "",
    order: string = ""
  ) {
    const { products, total } = await loadProducts(lim, skip, sort, order);
    this.productsList.innerHTML = "";

    products.forEach((product: Product) => {
      const productCard = document.createElement("li");
      productCard.classList.add("product-card");

      if (product.discountPercentage) {
        const discount = document.createElement("div");
        discount.classList.add("product-card__discount");
        discount.textContent = `-${Math.floor(product.discountPercentage)}%`;
        productCard.appendChild(discount);
      }

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
      shareBtn.innerHTML = `<img src="./src/assets/images/action-share.png" /> Share`;

      const compareBtn = document.createElement("button");
      compareBtn.classList.add("product-card__action-btn");
      compareBtn.innerHTML = `<img src="./src/assets/images/action-change.png" /> Compare`;

      const favoriteBtn = document.createElement("button");
      favoriteBtn.classList.add("product-card__action-btn", "action-favorite");
      favoriteBtn.innerHTML = `<img src="./src/assets/images/action-favorite.png" /> Like`;

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
      productCard.append(img, container, overlay);
      this.productsList.append(productCard);
    });

    this.updateFilterInfo(products.length, total);
    return { total };
  }

  private updateFilterInfo(showing: number, total: number) {
    this.filterBarInfo.innerHTML = `Showing <span>${showing}</span> of <span>${total}</span> results`;
  }

  setupPagination(loadProducts: Function) {
    const itemsPerPage = parseInt(this.itemsPerPageSelect.value);
    this.pageBtnsContainer.innerHTML = "";

    this.itemsPerPageSelect.addEventListener("click", (e: Event) => {
      const select = e.target as HTMLSelectElement;
      this.renderProductsCards(loadProducts, +select.value);
    });

    for (let i = 1; i <= 10; i += 1) {
      const btn = document.createElement("button");
      btn.className = "products__page-btn";
      btn.textContent = i.toString();
      btn.addEventListener("click", () => {
        this.productsList.innerHTML = "";
        this.renderProductsCards(
          loadProducts,
          itemsPerPage,
          (i - 1) * itemsPerPage
        );
      });
      this.pageBtnsContainer.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = "products__page-btn";
    nextBtn.textContent = "Next";
    this.pageBtnsContainer.appendChild(nextBtn);
  }

  initFilters(loadProducts: Function) {
    this.filterSelect.addEventListener("change", async (e) => {
      const select = e.target as HTMLSelectElement;
      if (select.value === "By category") {
        const { products } = await loadProducts(100);
        const categories = [
          ...new Set(products.map((p: Product) => p.category)),
        ];
        this.showCategoryFilter(categories, loadProducts);
      } else if (select.value === "By price") {
        this.showPriceFilter(loadProducts);
      }
    });
  }

  private showCategoryFilter(categories: any, loadProducts: Function) {
    const modal = document.createElement("div");
    modal.className = "filter-modal";
    modal.innerHTML = `
      <div class="filter-modal-content">
        <h3>Filter by Category</h3>
        <ul class="category-list">
          ${categories
            .map(
              (cat: string) =>
                `<li><input type="checkbox" id="cat-${cat}" name="${cat}"><label for="cat-${cat}">${cat}</label></li>`
            )
            .join("")}
        </ul>
        <button class="apply-filter">Apply</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".apply-filter")?.addEventListener("click", () => {
      const selected = [...modal.querySelectorAll("input:checked")].map(
        (el) => {
          const input = el as HTMLInputElement;
          return input.name;
        }
      );
      modal.remove();
      this.applyCategoryFilter(selected, loadProducts);
    });
  }

  private async applyCategoryFilter(
    categories: string[],
    loadProducts: Function
  ) {
    const { products, total } = await loadProducts(100);
    const filtered = products.filter((p: Product) =>
      categories.includes(p.category!)
    );
    this.productsList.innerHTML = "";

    filtered.forEach((product: Product) => {
      const productCard = document.createElement("li");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <img src="${product.thumbnail}" />
        <div class="product-card__container">
          <h3>${product.title}</h3>
          <p>Category: ${product.category}</p>
          <h4>$${product.price}</h4>
        </div>
      `;
      this.productsList.appendChild(productCard);
    });

    this.updateFilterInfo(filtered.length, total);
  }

  private showPriceFilter(loadProducts: Function) {
    const modal = document.createElement("div");
    modal.className = "filter-modal";
    modal.innerHTML = `
      <div class="filter-modal-content">
        <h3>Filter by Price</h3>
        <div class="price-range">
          <input type="range" id="price-min" min="0" max="2000" value="0">
          <input type="range" id="price-max" min="0" max="2000" value="2000">
          <div class="price-values">
            <span id="min-value">$0</span>
            <span id="max-value">$2000</span>
          </div>
        </div>
        <button class="apply-filter">Apply</button>
      </div>
    `;

    document.body.appendChild(modal);

    const minInput = modal.querySelector("#price-min") as HTMLInputElement;
    const maxInput = modal.querySelector("#price-max") as HTMLInputElement;
    const minValue = modal.querySelector("#min-value") as HTMLSpanElement;
    const maxValue = modal.querySelector("#max-value") as HTMLSpanElement;

    minInput.addEventListener(
      "input",
      () => (minValue.textContent = `$${minInput.value}`)
    );
    maxInput.addEventListener(
      "input",
      () => (maxValue.textContent = `$${maxInput.value}`)
    );

    modal.querySelector(".apply-filter")?.addEventListener("click", () => {
      const min = parseInt(minInput.value);
      const max = parseInt(maxInput.value);
      modal.remove();
      this.applyPriceFilter(min, max, loadProducts);
    });
  }

  private async applyPriceFilter(
    min: number,
    max: number,
    loadProducts: Function
  ) {
    const { products, total } = await loadProducts(100);
    const filtered = products.filter(
      (p: Product) => p.price >= min && p.price <= max
    );
    this.productsList.innerHTML = "";

    filtered.forEach((product: Product) => {
      const productCard = document.createElement("li");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <img src="${product.thumbnail}" />
        <div class="product-card__container">
          <h3>${product.title}</h3>
          <p>Category: ${product.category}</p>
          <h4>$${product.price}</h4>
        </div>
      `;
      this.productsList.appendChild(productCard);
    });

    this.updateFilterInfo(filtered.length, total);
  }

  initSort(loadProducts: Function) {
    this.sortBtn.addEventListener("change", async (e) => {
      const select = e.target as HTMLSelectElement;
      if (select.value === "price-asc") {
        this.productsList.innerHTML = "";
        await this.renderProductsCards(loadProducts, 16, 0, "price", "asc");
      } else if (select.value === "price-desc") {
        this.productsList.innerHTML = "";
        await this.renderProductsCards(loadProducts, 16, 0, "price", "desc");
      }
    });
  }
}
