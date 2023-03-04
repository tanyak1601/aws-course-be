import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

const defaultHeaders: Record<string, boolean | number | string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: { ...defaultHeaders },
    body: JSON.stringify(response?.message),
  };
};

export const formatErrorResponse = (statusCode: number, message: string) => {
  return {
    statusCode,
    headers: { ...defaultHeaders },
    body: JSON.stringify({ message }),
  };
};
