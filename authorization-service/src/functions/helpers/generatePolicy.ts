import { APIGatewayAuthorizerResult } from 'aws-lambda';

export const generatePolicy = (
  principalId: string,
  resource: string,
  effect = 'Allow'
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
