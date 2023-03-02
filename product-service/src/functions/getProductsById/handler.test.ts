import { getProductsById } from './handler';
import { getById } from './helpers';

jest.mock('./helpers', () => ({
  getById: jest.fn(),
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
    (getById as jest.Mock).mockReturnValue(
      Promise.resolve({
        id: 1,
        title: 'Modificado',
        price: 491,
        description:
          'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
        images: [
          'https://api.lorem.space/image/shoes?w=640&h=480&r=9487',
          'https://api.lorem.space/image/shoes?w=640&h=480&r=51',
          'https://api.lorem.space/image/shoes?w=640&h=480&r=1096',
        ],
        creationAt: '2023-02-24T19:43:30.000Z',
        updatedAt: '2023-02-24T20:00:58.000Z',
        category: {
          id: 4,
          name: 'Shoes',
          image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=1404',
          creationAt: '2023-02-24T19:43:30.000Z',
          updatedAt: '2023-02-24T19:43:30.000Z',
        },
      })
    );
    const res = await getProductsById(baseEvent);
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.body).message).toEqual({
      id: 1,
      title: 'Modificado',
      price: 491,
      description:
        'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=9487',
    });
  });

  it('should return Product not found', async () => {
    (getById as jest.Mock).mockReturnValue(Promise.resolve(undefined));
    const res = await getProductsById(baseEvent);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual('{"message":"Product not found"}');
  });

  it('should return Internal Server Error', async () => {
    (getById as jest.Mock).mockRejectedValueOnce(Promise.reject('error'));
    const res = await getProductsById(baseEvent);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"message":"Internal Server Error"}');
  });
});
