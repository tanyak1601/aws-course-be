export type CheckOutPayload = {
  userId: string,
  cartId: string,
  payment: {
    type: string,
    address?: string,
    creditCard?: string,
  },
  delivery: {
    type: string,
    address: string,
  },
  comments: string,
  total: number;
};
