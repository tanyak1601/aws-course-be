import AWS from 'aws-sdk';
import { Product, Products, StocksItem, ProductInfo } from 'functions/types';
import { mapProductsResult, mapProductResult } from '../helpers/product.mapper';

const dynamodb = new AWS.DynamoDB.DocumentClient();

const scanProducts = async (): Promise<Products> => {
  const res = await dynamodb
    .scan({
      TableName: process.env.PRODUCTS_TABLE_NAME,
    })
    .promise();

  return res.Items as Products;
};

const queryProduct = async (id: string): Promise<Product> => {
  const res = await dynamodb
    .query({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': id },
    })
    .promise();

  return res.Items?.[0] as Product;
};

const scanStocks = async (): Promise<StocksItem[]> => {
  const res = await dynamodb
    .scan({
      TableName: process.env.STOCKS_TABLE_NAME,
    })
    .promise();

  return res.Items as StocksItem[];
};

const queryStock = async (product_id: string): Promise<StocksItem> => {
  const res = await dynamodb
    .query({
      TableName: process.env.STOCKS_TABLE_NAME,
      KeyConditionExpression: 'product_id = :product_id',
      ExpressionAttributeValues: { ':product_id': product_id },
    })
    .promise();

  return res.Items?.[0] as StocksItem;
};

export const scanProductsResult = async (): Promise<ProductInfo[]> => {
  const res = await Promise.all([scanProducts(), scanStocks()]);
  return mapProductsResult(...res);
};

export const queryProductResult = async (id: string): Promise<ProductInfo> => {
  const res = await Promise.all([queryProduct(id), queryStock(id)]);
  return mapProductResult(...res);
};
