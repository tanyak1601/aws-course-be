import type { AWS } from '@serverless/typescript';
import getProductsList from 'functions/getProductsList';
import getProductsById from 'functions/getProductsById';
import createProduct from 'functions/createProduct';
import catalogBatchProcess from 'functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-offline',
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE_NAME: '${env:PRODUCTS_TABLE_NAME}',
      STOCKS_TABLE_NAME: '${env:STOCKS_TABLE_NAME}',
      SQS_URL: {
        Ref: 'SQSQueue',
      },
      SNS_ARN: {
        Ref: 'SNSTopic',
      },
      CREATE_PRODUCT_TOPIC_EMAIL: '${env:CREATE_PRODUCT_TOPIC_EMAIL}',
      CREATE_UNIQUE_PRODUCT_TOPIC_EMAIL:
        '${env:CREATE_UNIQUE_PRODUCT_TOPIC_EMAIL}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'dynamodb:*',
            Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/*',
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
          },
          {
            Effect: 'Allow',
            Action: 'sns:*',
            Resource: { Ref: 'SNSTopic' },
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${self:provider.environment.CREATE_PRODUCT_TOPIC_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
        },
      },
      SNSSubscriptionForUniqueProducts: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint:
            '${self:provider.environment.CREATE_UNIQUE_PRODUCT_TOPIC_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
          FilterPolicy: {
            price: [{ numeric: ['>=', 100] }],
          },
        },
      },
    },
  },
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  package: {
    individually: true,
    excludeDevDependencies: true,
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      packager: 'yarn',
    },
    autoswagger: {
      typefiles: ['./src/functions/types.ts'],
      host: '82or31sgi6.execute-api.eu-west-1.amazonaws.com/dev',
      schemes: ['https'],
    },
  },
};

module.exports = serverlessConfiguration;
