import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getList } from './helpers'

const getProductsList = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>  => {
  const res = await getList();
  return formatJSONResponse({
    message: res,
    event,
  });
};

export const main = middyfy(getProductsList);
