import { handlerPath } from 'libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: {
          name: 'basicAuthorizer',
          arn: '${self:provider.environment.BASIC_AUTHORIZER_ARN}',
          type: 'token',
          identitySource: 'method.request.header.Authorization',
          resultTtlInSeconds: 0,
        },
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
      },
    },
  ],
};
