import axios from "axios";

export default class ServiceProducts {
  constructor() {}

  async loadProducts(lim: number, skip: number) {
    const { data } = await axios.get(
      `https://dummyjson.com/products?&limit=${lim}&skip=${skip}`
    );
    return data;
  }

  async loadOneProduct(productId: string) {
    const { data } = await axios.get(
      `https://dummyjson.com/products/${productId}`
    );
    return data;
  }

  async getAllProducts() {
    const { data } = await axios.get(`https://dummyjson.com/products`);
    return data;
  }
}
