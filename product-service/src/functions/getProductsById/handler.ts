import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse, formatErrorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { asyncPipe, mapProduct } from "@functions/helpers";
import { getById } from "./helpers";
import { Product } from "@functions/types";

const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const res: Product = await asyncPipe(
      getById,
      mapProduct
    )(event?.pathParameters?.productId);

    if (res.id) {
      return formatJSONResponse({
        message: res,
        event,
      });
    }

    return formatErrorResponse(404, "Product not found");
  } catch (error) {
    console.log(error);

    return formatErrorResponse(500, "Internal Server Error");
  }
};

// try {
//   const {
//     pathParameters: { productId = '' },
//   } = event;
//   const { products } = await getAvailableProducts();
//   const productById = products.find((product) => product.id.toLowerCase() === productId.toLowerCase());
//   if (productById) {
//     return formatJSONSuccessResponse({ product: productById });
//   }
//   return formatErrorResponse(404, 'Product not found');
// } catch (error: unknown) {
//   console.log('The internal error occurred: ', error);
//   return formatErrorResponse(500, 'Server Internal Error');
// }

export const main = middyfy(getProductsById);
