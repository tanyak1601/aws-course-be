import { handlerPath } from 'libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/products/{productId}',
        cors: true,
        responseData: {
          200: {
            description: 'successful API Responce',
            bodyType: 'Product',
          },
          404: 'Product not found',
          500: 'Internal Server Error',
        },
      },
    },
  ],
};
