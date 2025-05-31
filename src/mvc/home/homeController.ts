import model from "./homeModel";
import view from "./homeView";

export default class HomeController {
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
