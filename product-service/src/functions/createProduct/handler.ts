import { v4 as uuidv4 } from 'uuid';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from 'libs/api-gateway';
import { middyfy } from 'libs/lambda';
import { addProduct } from 'functions/handlers';
import {
  asyncPipe,
  logRequest,
  mapProductPayload,
  validateProductPayload,
} from 'functions/helpers';
import { ProductPayload } from 'functions/types';

export const createProduct = async (
  event: Omit<APIGatewayProxyEvent, 'body'> & { body: ProductPayload }
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event);

    const validationResult = validateProductPayload(event.body);
    if (validationResult) {
      return formatErrorResponse(
        400,
        `Invalid product data. ${validationResult}`
      );
    }
    const res = await asyncPipe(
      mapProductPayload,
      addProduct
    )({ ...event.body, id: uuidv4() });

    return formatJSONResponse(
      {
        message: res,
        event,
      },
      201
    );
  } catch (error) {
    console.log(error);

    return formatErrorResponse(500, 'Internal Server Error');
  }
};

export const main = middyfy(createProduct);
