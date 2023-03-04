export interface Product {
  id: number;
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

export interface ProductInfo extends Product {
  count: number;
}
