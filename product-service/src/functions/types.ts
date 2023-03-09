export interface ProductPayload {
  title: string;
  price: number;
  description: string;
  image: string;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
}

export type Products = Product[];

export type StocksItem = {
  product_id: string;
  count: number;
};

export interface ProductInfo {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  count: number;
}
