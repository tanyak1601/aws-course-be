import { UPLOADED_PREFIX } from 'functions/constants';
import { handlerPath } from 'libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
      },
      s3: {
        bucket: process.env.IMPORT_SERVICE_BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: {
          prefix: UPLOADED_PREFIX,
        },
        existing: true,
      },
    },
  ],
};
