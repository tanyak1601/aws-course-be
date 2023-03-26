import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerCallback,
  Context,
} from 'aws-lambda';
import { generatePolicy } from '../helpers';

const basicAuthorizer = (
  event: APIGatewayTokenAuthorizerEvent,
  _ctx: Context,
  cb: APIGatewayAuthorizerCallback
) => {
  try {
    console.log('event', JSON.stringify(event));

    const authToken = event.authorizationToken;

    if (!authToken) {
      return cb('Unauthorized');
    }

    const base64Creds = authToken.split(' ')[1];
    const [username, password] = Buffer.from(base64Creds, 'base64')
      .toString('utf-8')
      .split(':');

    const effect =
      username && password && process.env[username] === password
        ? 'Allow'
        : 'Deny';

    const policy = generatePolicy(base64Creds, event.methodArn, effect);

    return cb(null, policy);
  } catch (error) {
    console.log(error);

    return cb(`Unauthorized: ${error.message}`);
  }
};

export const main = basicAuthorizer;
