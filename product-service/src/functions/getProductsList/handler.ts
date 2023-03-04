import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from 'libs/api-gateway';
import { middyfy } from 'libs/lambda';
import { ProductInfo } from 'functions/types';
import { logRequest } from 'functions/helpers';
import { getProducts } from '../handlers/index';

export const getProductsList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event);

    const products: ProductInfo[] = await getProducts();

    return formatJSONResponse({
      message: products,
      event,
    });
  } catch (error) {
    console.log(error);

    return formatErrorResponse(500, 'Internal Server Error');
  }
};

export const main = middyfy(getProductsList);
