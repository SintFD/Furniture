export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity?: number;
  discountPercentage?: number;
  description?: string;
  category?: string;
}

export interface CartItem {
  id: number;
  quantity: number;
}
