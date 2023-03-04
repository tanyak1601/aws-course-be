import { ProductPayload } from 'functions/types';

export const validateProductPayload = (payload: ProductPayload) => {
  if (!payload) {
    return 'No payload data';
  }

  if (!payload.title) {
    return 'Title is missing in payload';
  }

  if (!payload.description) {
    return 'Description is missing in payload';
  }

  if (!payload.image) {
    return 'Image is missing in payload';
  }

  if (!payload.price) {
    return 'Price is missing in payload';
  }

  if (!payload.count) {
    return 'Count is missing in payload';
  }

  return null;
};
