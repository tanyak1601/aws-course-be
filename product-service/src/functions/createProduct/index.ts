import { handlerPath } from 'libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/products',
        cors: true,
        bodyType: 'ProductPayload',
        responseData: {
          201: {
            description: 'successful API Responce',
            bodyType: 'ProductInfo',
          },
          404: 'Invalid product data',
          500: 'Internal Server Error',
        },
      },
    },
  ],
};
