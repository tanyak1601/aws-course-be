import mockResponse from './mockResult.json';
import { Product } from './types'

export const getList = async (): Promise<Product[]> => Promise.resolve(mockResponse.map(el => ({
  id: el.id,
  title: el.title,
  price: el.price,
  description: el.description,
  image: el.images[0],
})));