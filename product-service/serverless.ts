import type { AWS } from '@serverless/typescript';
import getProductsList from 'functions/getProductsList';
import getProductsById from 'functions/getProductsById';

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
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'dynamodb:*',
        Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/*',
      },
    ],
  },

  functions: { getProductsList, getProductsById },
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
