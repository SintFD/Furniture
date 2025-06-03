import "../assets/product.css";
import SingleProductController from "../mvc/singleProduct/singleProductController";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    console.error("Product ID is missing from URL");
    return;
  }
  const controller = new SingleProductController();
  controller.init(id);
});
