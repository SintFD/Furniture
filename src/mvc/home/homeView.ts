import type { Product } from "../../types/index";

export default class HomeController {
  private productsList: HTMLUListElement;
  private productsButton: HTMLButtonElement;
  constructor() {
    this.productsList = document.querySelector(".products__list")!;
    this.productsButton = document.querySelector(".products_button")!;
  }

  async renderProductsCards(loadProducts: Function, skip: number = 0) {
    const { products } = await loadProducts(8, skip);
    products.forEach(
      ({
        title,
        category,
        thumbnail: img,
        id,
        price,
        discountPercentage: discount,
      }: Product) => {
        const productCard = document.createElement("li");

        // productCard.value = id;
        productCard.classList.add("product-card");

        productCard.innerHTML = `<div class='product-card__discount'>-${Math.floor(
          discount
        )}%</div>
        <img src=${img}>
        <div class='product-card__container'>
         <h3>${title}</h3>
         <p>Category: ${category}</p>
         <h4>${price}$</h4>
        </div>
        `;

        productCard.addEventListener("click", () => {
          location.assign(`/product.html?id=${id}`);
        });

        this.productsList.append(productCard);
      }
    );
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
