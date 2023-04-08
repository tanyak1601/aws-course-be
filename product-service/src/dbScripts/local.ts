import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { mockResult } from 'functions/mocks';

const fillTables = async (): Promise<void> => {
  const dynamodb = new AWS.DynamoDB({
    endpoint: 'http://localhost:8000',
    region: process.env.REGION,
  });

  const dynamodbClient = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:8000',
    region: process.env.REGION,
  });

  try {
    const productsTableName = process.env.PRODUCTS_TABLE_NAME;
    const stocksTableName = process.env.STOCKS_TABLE_NAME;

    const productsTableParams = {
      TableName: productsTableName,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'title', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'title', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    };

    await dynamodb.createTable(productsTableParams).promise();

    const stocksTableParams = {
      TableName: stocksTableName,
      KeySchema: [
        { AttributeName: 'product_id', KeyType: 'HASH' },
        { AttributeName: 'count', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'product_id', AttributeType: 'S' },
        { AttributeName: 'count', AttributeType: 'N' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    };

    await dynamodb.createTable(stocksTableParams).promise();

    const promiseArr = [];
    mockResult.map((el) => {
      const id = uuidv4();
      promiseArr.push(
        dynamodbClient
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
        dynamodbClient
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
