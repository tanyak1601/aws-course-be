import { getProductsList } from './handler';
import { getList } from './helpers';

jest.mock('./helpers', () => ({
  getList: jest.fn(),
}));

describe('getProductsList', () => {
  const baseEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: 'products',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: undefined,
    resource: '',
  };

  it('should return product list', async () => {
    (getList as jest.Mock).mockReturnValueOnce(
      Promise.resolve([
        {
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
        },
        {
          id: 8,
          title: 'Gorgeous Bronze Chips',
          price: 443,
          description:
            'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
          images: [
            'https://api.lorem.space/image/shoes?w=640&h=480&r=3622',
            'https://api.lorem.space/image/shoes?w=640&h=480&r=9571',
            'https://api.lorem.space/image/shoes?w=640&h=480&r=7182',
          ],
          creationAt: '2023-02-24T19:43:30.000Z',
          updatedAt: '2023-02-24T19:43:30.000Z',
          category: {
            id: 4,
            name: 'Shoes',
            image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=1404',
            creationAt: '2023-02-24T19:43:30.000Z',
            updatedAt: '2023-02-24T19:43:30.000Z',
          },
        },
      ])
    );
    const res = await getProductsList(baseEvent);
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.body).message).toEqual([
      {
        id: 1,
        title: 'Modificado',
        price: 491,
        description:
          'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
        image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=9487',
      },
      {
        id: 8,
        title: 'Gorgeous Bronze Chips',
        price: 443,
        description:
          'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
        image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=3622',
      },
    ]);
  });

  it('should return Internal Server Error', async () => {
    (getList as jest.Mock).mockRejectedValueOnce(Promise.reject('error'));
    const res = await getProductsList(baseEvent);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"message":"Internal Server Error"}');
  });
});
