import axios from "axios";

export default class ServiceProducts {
  constructor() {}

  async loadProducts() {
    const { data } = await axios.get(
      "https://dummyjson.com/products?limit=10&skip=10"
    );

    console.log(data);
  }
}

// fetch('https://dummyjson.com/products?limit=10&skip=10&select=title,price')
// .then(res => res.json())
// .then(console.log);
