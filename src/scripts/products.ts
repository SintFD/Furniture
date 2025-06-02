import "../assets/products.css";

import ProductsController from "../mvc/products/productsController";
import ProductsModel from "../mvc/products/productsModel";
import ProductsView from "../mvc/products/productsView";

const productsController = new ProductsController(
  new ProductsModel(),
  new ProductsView()
);
productsController.init();
