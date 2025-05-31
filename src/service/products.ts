import axios from "axios";
import type { Product } from "../types";

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

export class ProductService {
  async getProductById(id: number): Promise<Product> {
    const response = await axios.get(`https://dummyjson.com/products/${id}`);
    const data = response.data;
    return {
      id: data.id,
      title: data.title,
      price: data.price,
      thumbnail: data.thumbnail,
      quantity: 1,
    };
  }
}
