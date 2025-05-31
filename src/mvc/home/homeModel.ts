import ServiceProducts from "../../service/products";

export default class HomeModel {
  async loadProducts(lim: number, skip: number) {
    const productsArr = new ServiceProducts();
    return await productsArr.loadProducts(lim, skip);
  }
}
