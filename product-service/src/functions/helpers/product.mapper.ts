import { Product, Products, StocksItem, ProductInfo } from 'functions/types';

export const mapProductsResult = (
  products: Products,
  stocks: StocksItem[]
): ProductInfo[] => {
  const countObject: Record<string, number> = stocks.reduce(
    (acc, el) => ({ ...acc, [el.product_id]: el.count }),
    {}
  );
  return products.map((el) => ({
    ...el,
    count: countObject[el.id],
  }));
};

export const mapProductResult = (
  product: Product,
  stock: StocksItem
): ProductInfo => {
  return (
    product && {
      ...product,
      count: stock?.count,
    }
  );
};
