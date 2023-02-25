import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse, formatErrorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { RawProduct } from "@functions/types";
import { mapProduct } from "@functions//helpers";
import { getList } from "./helpers";

const getProductsList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const products: RawProduct[] = await getList();

    return formatJSONResponse({
      message: products.map(mapProduct),
      event,
    });
  } catch (error) {
    console.log(error);

    return formatErrorResponse(500, "Internal Server Error");
  }
};

export const main = middyfy(getProductsList);
