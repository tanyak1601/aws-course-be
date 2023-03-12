import { mock } from 'aws-sdk-mock';
import { importProductsFile } from './handler';

jest.mock('libs/lambda', () => ({
  middyfy: (params) => params,
}));

mock('S3', 'getSignedUrl', (_action, _params, callback) => {
  return callback(null, 'test-signedUrl');
});

describe('importProductsFile', () => {
  const baseEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: 'import',
    pathParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: undefined,
    resource: '',
    queryStringParameters: {
      name: 'test.csv',
    },
  };

  it('should return signed url', async () => {
    const res = await importProductsFile(baseEvent);
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.body)).toEqual('test-signedUrl');
  });

  it('should return Bad Request', async () => {
    const res = await importProductsFile({
      ...baseEvent,
      queryStringParameters: {},
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual('{"message":"Bad Request"}');
  });
});
