import { S3 } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from 'libs/api-gateway';
import { middyfy } from 'libs/lambda';
import { Operations } from 'functions/types';
import {
  CSV_CONTENT_TYPE,
  EXPIRE_PERIOD,
  UPLOADED_PREFIX,
} from 'functions/constants';

export const importProductsFile = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const s3 = new S3({ region: process.env.REGION });
    const fileName = event.queryStringParameters.name;

    if (!fileName) {
      return formatErrorResponse(400, 'Bad Request');
    }

    const url = await s3.getSignedUrlPromise(Operations.PUT_OBJECT, {
      Bucket: process.env.IMPORT_SERVICE_BUCKET_NAME,
      Key: `${UPLOADED_PREFIX}/${fileName}`,
      Expires: EXPIRE_PERIOD,
      ContentType: CSV_CONTENT_TYPE,
    });

    return formatJSONResponse({
      message: url,
      event,
    });
  } catch (error) {
    console.log(error);
    return formatErrorResponse(500, 'Internal Server Error');
  }
};

export const main = middyfy(importProductsFile);
