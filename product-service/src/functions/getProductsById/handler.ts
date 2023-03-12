import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from 'libs/api-gateway';
import { middyfy } from 'libs/lambda';
import { Product } from 'functions/types';
import { getProduct } from 'functions/handlers';
import { logRequest } from 'functions/helpers';

export const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event);

    const res: Product = await getProduct(event.pathParameters.productId);

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
