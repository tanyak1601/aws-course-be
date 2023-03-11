import { S3 } from 'aws-sdk';
import csv from 'csv-parser';
import { S3Event } from 'aws-lambda';
import { middyfy } from 'libs/lambda';

export const importFileParser = async (event: S3Event): Promise<void> => {
  try {
    const s3 = new S3({ region: process.env.REGION });

    for (const record of event.Records) {
      const s3Stream = s3
        .getObject({
          Bucket: record.s3.bucket.name,
          Key: record.s3.object.key,
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
        .on('end', () => {
          console.log(`importFileParser: file ${record.s3.object.key} parsed!`);
        });
    }
  } catch (error) {
    console.log(error);
  }
};

export const main = middyfy(importFileParser);
