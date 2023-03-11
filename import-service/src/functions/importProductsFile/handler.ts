import { S3 } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from 'libs/api-gateway';
import { middyfy } from 'libs/lambda';
import { Operations } from 'functions/types';
import {
  CSV_CONTENT_TYPE,
  EXPIRE_PERIOD,
  UPLOADED_FOLDER,
} from 'functions/constants';

export const getProductsList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const s3 = new S3({ region: process.env.REGION });
    const fileName = event.queryStringParameters.name;

    if (!fileName) {
      return formatErrorResponse(400, 'Bad Request');
    }

    const url = s3.getSignedUrl(Operations.PUT_OBJECT, {
      Bucket: process.env.IMPORT_SERVICE_BUCKET_NAME,
      Key: `${UPLOADED_FOLDER}/${fileName}`,
      Expires: EXPIRE_PERIOD,
      ContentType: CSV_CONTENT_TYPE,
    });

    console.log(url);

    return formatJSONResponse({
      message: url,
      event,
    });
  } catch (error) {
    console.log(error);
    return formatErrorResponse(500, 'Internal Server Error');
  }
};

export const main = middyfy(getProductsList);
