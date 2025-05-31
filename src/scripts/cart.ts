import "../assets/cart.css";
import CartController from "../mvc/cart/cartController";
import CartModel from "../mvc/cart/cartModel";
import CartView from "../mvc/cart/cartView";

document.addEventListener("DOMContentLoaded", () => {
  const model = new CartModel();
  const view = new CartView();
  const controller = new CartController(model, view);

  controller.init();
});
