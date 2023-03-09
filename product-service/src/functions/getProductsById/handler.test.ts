import { getProductsById } from './handler';
import { getProduct } from '../handlers';

jest.mock('../handlers', () => ({
  getProduct: jest.fn(),
}));

describe('getProductsById', () => {
  const baseEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: 'products',
    pathParameters: { productId: '1' },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: undefined,
    resource: '',
  };

  it('should return product by id', async () => {
    const productInfo = {
      id: 1,
      title: 'Modificado',
      price: 491,
      description:
        'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=9487',
      count: 2,
    };

    (getProduct as jest.Mock).mockReturnValue(Promise.resolve(productInfo));
    const res = await getProductsById(baseEvent);
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.body)).toEqual(productInfo);
  });

  it('should return Product not found', async () => {
    (getProduct as jest.Mock).mockReturnValue(Promise.resolve(undefined));
    const res = await getProductsById(baseEvent);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual('{"message":"Product not found"}');
  });

  it('should return Internal Server Error', async () => {
    (getProduct as jest.Mock).mockRejectedValueOnce(Promise.reject('error'));
    const res = await getProductsById(baseEvent);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"message":"Internal Server Error"}');
  });
});
