import type { Product } from "../../types/index";
import { getProductById } from "./singleProductModel";
import SingleProductView from "./singleProductView";
import ServiceProducts from "../../service/products";

export default class SingleProductController {
  private view: SingleProductView;
  private service: ServiceProducts;

  constructor() {
    this.view = new SingleProductView();
    this.service = new ServiceProducts();
  }

  async init(productId: string) {
    try {
      const product: Product = await getProductById(productId);
      this.view.render(product);
      this.view.bindQuantityControls();
      this.view.bindCartAndFavorites(product);

      const { products } = await this.service.loadProducts(4, 0);
      this.view.renderRelatedProducts(
        products,
        async (limit: number, skip: number) => {
          return this.service.loadProducts(limit, skip);
        }
      );
    } catch (error) {
      console.error("Ошибка загрузки продукта:", error);
      alert("Не удалось загрузить данные продукта.");
    }
  }
}
