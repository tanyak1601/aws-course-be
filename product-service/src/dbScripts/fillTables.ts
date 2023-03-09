import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { mockResult } from 'functions/mocks';

const fillTables = async (): Promise<void> => {
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION,
  });

  try {
    const promiseArr = [];
    mockResult.map((el) => {
      const id = uuidv4();
      promiseArr.push(
        dynamodb
          .put({
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: {
              id,
              title: el.title,
              description: el.description,
              price: el.price,
              image: el.images[0],
            },
          })
          .promise(),
        dynamodb
          .put({
            TableName: process.env.STOCKS_TABLE_NAME,
            Item: {
              product_id: id,
              count: Math.floor(Math.random() * 100),
            },
          })
          .promise()
      );
    });
    await Promise.all(promiseArr);
    console.log('Tables are filled');
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await fillTables();
})();
