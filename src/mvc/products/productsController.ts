import model from "./productsModel";
import view from "./productsView";

export default class ProductsController {
  private model: model;
  private view: view;
  constructor(model: model, view: view) {
    this.model = model;
    this.view = view;
  }
  async init() {
    await this.view.renderProductsCards(
      this.model.loadProducts.bind(this.model)
    );
    this.view.setupPagination(this.model.loadProducts.bind(this.model));
    this.view.initFilters(this.model.loadProducts.bind(this.model));
    this.view.initSort(this.model.loadProducts.bind(this.model));

    this.view.itemsPerPageSelect.addEventListener("change", async () => {
      await this.view.renderProductsCards(
        this.model.loadProducts.bind(this.model)
      );
      this.view.setupPagination(this.model.loadProducts.bind(this.model));
    });
  }
}
