import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from 'libs/api-gateway';
import { middyfy } from 'libs/lambda';
import { Product } from 'functions/types';
import { queryProductResult } from 'functions/handlers';

export const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const res: Product = await queryProductResult(
      event.pathParameters.productId
    );

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
