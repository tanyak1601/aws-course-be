import { UPLOADED_PREFIX, PARSED_PREFIX } from './../constants';
import { S3 } from 'aws-sdk';
import csv from 'csv-parser';
import { S3Event } from 'aws-lambda';
import { middyfy } from 'libs/lambda';

export const importFileParser = async (event: S3Event): Promise<void> => {
  try {
    const s3 = new S3({ region: process.env.REGION });

    for (const record of event.Records) {
      const bucketName = record.s3.bucket.name;
      const fileKey = record.s3.object.key;
      const s3Stream = s3
        .getObject({
          Bucket: bucketName,
          Key: fileKey,
        })
        .createReadStream();

      s3Stream
        .pipe(csv())
        .on('data', (data) => {
          console.log(`importFileParser: ${data}`);
        })
        .on('error', (error) => {
          console.log(`importFileParser error: ${error}`);
        })
        .on('end', async () => {
          console.log(`importFileParser: file ${fileKey} parsed!`);

          await s3
            .copyObject({
              Bucket: bucketName,
              CopySource: `${bucketName}/${fileKey}`,
              Key: fileKey.replace(UPLOADED_PREFIX, PARSED_PREFIX),
            })
            .promise();

          await s3
            .deleteObject({
              Bucket: bucketName,
              Key: fileKey,
            })
            .promise();

          console.log(
            `importFileParser: file ${fileKey.replace(
              UPLOADED_PREFIX,
              ''
            )} moved to 'parsed' folder`
          );
        });
    }
  } catch (error) {
    console.log(error);
  }
};

export const main = middyfy(importFileParser);
