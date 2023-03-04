import { scanProductsResult } from './../handlers/index';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from 'libs/api-gateway';
import { middyfy } from 'libs/lambda';
import { ProductInfo } from 'functions/types';

export const getProductsList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const products: ProductInfo[] = await scanProductsResult();

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
