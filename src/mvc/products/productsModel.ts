import ServiceProducts from "../../service/products";

export default class ProductsModel {
  async loadProducts(limit = 16, skip = 0, sort = "", order = "") {
    const service = new ServiceProducts();
    const data = await service.loadProducts(limit, skip, sort, order);
    return {
      products: data.products,
      total: data.total,
    };
  }
}
