import ServiceProducts from "../../service/products";

export default class ProductsModel {
  async loadProducts(limit = 16, skip = 0) {
    const service = new ServiceProducts();
    return await service.loadProducts(limit, skip);
  }
}
