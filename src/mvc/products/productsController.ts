import model from "./productsModel";
import view from "./productsView";

export default class ProductsController {
  private model: model;
  private view: view;
  constructor(model: model, view: view) {
    this.model = model;
    this.view = view;
  }
  init() {
    this.view.renderProductsCards(this.model.loadProducts);
  }
}
