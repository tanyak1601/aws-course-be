/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyEvent } from 'aws-lambda';

export const logRequest = (
  event: Omit<APIGatewayProxyEvent, 'body'> & { body: any }
): void => {
  console.log(
    `Event path: '/products, pathParameters: ${JSON.stringify(
      event.pathParameters
    )}, payload: ${JSON.stringify(event.body)}`
  );
};
