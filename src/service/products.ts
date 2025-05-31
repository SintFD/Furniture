import axios from "axios";
import type { Product } from "../types";

export default class ServiceProducts {
  constructor() {}

  async loadProducts() {
    const { data } = await axios.get(
      "https://dummyjson.com/products?limit=10&skip=10"
    );

    console.log(data);
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
