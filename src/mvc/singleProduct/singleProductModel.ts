import type { Product } from "../../types";

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return await res.json();
}
