import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from 'libs/api-gateway';
import { middyfy } from 'libs/lambda';
import { asyncPipe, mapProduct } from 'functions/helpers';
import { getById } from './helpers';
import { Product } from 'functions/types';

export const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const res: Product = await asyncPipe(
      getById,
      mapProduct
    )(event?.pathParameters?.productId);

    if (res) {
      return formatJSONResponse({
        message: res,
        event,
      });
    }

    return formatErrorResponse(404, 'Product not found');
  } catch (error) {
    console.log(error);

    return formatErrorResponse(500, 'Internal Server Error');
  }
};

export const main = middyfy(getProductsById);
