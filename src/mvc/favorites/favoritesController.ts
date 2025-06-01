import { ProductAPIService } from "../../service/products";
import LocalStorage from "../../utils/storage";
import FavoritesView from "./favoritesView";

export default class FavoritesController {
  static async init() {
    LocalStorage.createLocalArr("localFavoritesArr");
    LocalStorage.createLocalArr("localCartArr");

    const favorites = LocalStorage.getLocalArr("localFavoritesArr");
    if (!favorites || favorites.length === 0) {
      FavoritesView.renderEmpty("favorites-container");
      return;
    }

    const service = new ProductAPIService();

    const products = await Promise.all(
      favorites.map((id) => service.getProductById(id))
    );

    FavoritesView.renderProducts(products, "favorites-container");
    this.attachEvents();
  }

  static attachEvents() {
    const container = document.getElementById("favorites-container");
    if (!container) return;

    container.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      const cartItem = target.closest(".cart-item") as HTMLElement;
      if (!cartItem) return;

      const id = Number(cartItem.dataset.id);
      if (!id) return;

      if (target.closest(".like-btn")) {
        LocalStorage.removeFromLocalArr("localFavoritesArr", id);
        cartItem.remove();

        const favorites = LocalStorage.getLocalArr("localFavoritesArr");
        if (favorites.length === 0) {
          FavoritesView.renderEmpty("favorites-container");
        }
      }

      if (target.classList.contains("add-btn")) {
        LocalStorage.setLocalArr("localCartArr", id);
        alert(`Продукт добавлен в корзину ✅`);
      }

      if (target.classList.contains("cart-image")) {
        const service = new ProductAPIService();
        const product = await service.getProductById(id);
        FavoritesView.showModal(product);
      }
    });
  }
}
