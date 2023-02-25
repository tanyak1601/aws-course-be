import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { RawProduct } from "@functions/types";
import { mapProduct } from "@functions//helpers";
import { getList } from "./helpers";

const getProductsList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const products: RawProduct[] = await getList();

  return formatJSONResponse({
    message: products.map(mapProduct),
    event,
  });
};

export const main = middyfy(getProductsList);
