import axios from "axios";

export default class ServiceProducts {
  constructor() {}

  async loadProducts(
    lim: number,
    skip: number,
    sortBy: string = "",
    order: string = ""
  ) {
    const { data } = await axios.get(
      `https://dummyjson.com/products?&limit=${lim}&skip=${skip}&sortBy=${sortBy}&order=${order}`
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
