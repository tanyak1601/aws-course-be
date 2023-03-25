import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { addProduct } from 'functions/handlers';
import { asyncPipe, mapProductPayload } from 'functions/helpers';
import { ProductPayload } from 'functions/types';

export const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  try {
    const sns = new SNS({ region: process.env.REGION });
    const products: ProductPayload[] = event.Records.map(({ body }) =>
      JSON.parse(body)
    );
    const promiseArr = [];

    products.forEach((product) => {
      const res = asyncPipe(
        mapProductPayload,
        addProduct
      )({ ...product, id: uuidv4() });

      promiseArr.push(res);
    });

    await Promise.all(promiseArr);

    try {
      await Promise.all(
        products.map((product) => {
          sns
            .publish({
              Subject: 'Products have been created',
              Message: JSON.stringify(product),
              TopicArn: process.env.SNS_ARN,
              MessageAttributes: {
                price: {
                  DataType: 'Number',
                  StringValue: `${product.price}`,
                },
              },
            })
            .promise();
        })
      );

      console.log(
        `SNS: ${
          products.length > 1
            ? products.length + ' products have been created'
            : products.length + ' product has been created'
        }`
      );
    } catch (err) {
      console.log(`SNS error: ${err}`);
    }
  } catch (error) {
    console.log(error);
  }
};
