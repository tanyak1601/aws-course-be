import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { asyncPipe, mapProduct } from "@functions/helpers";
import { getById } from "./helpers";
import { Product } from "@functions/types";

const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const res: Product = await asyncPipe(
    getById,
    mapProduct
  )(event?.pathParameters?.productId);

  return formatJSONResponse({
    message: res,
    event,
  });
};

export const main = middyfy(getProductsById);
