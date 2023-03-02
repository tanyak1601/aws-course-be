import { Product, RawProduct } from 'functions/types';

export const mapProduct = (el: RawProduct): Product | undefined =>
  el && {
    id: el.id,
    title: el.title,
    price: el.price,
    description: el.description,
    image: el.images?.[0],
  };
