import { UPLOADED_PREFIX } from 'functions/constants';
import { handlerPath } from 'libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: '${self:provider.environment.IMPORT_SERVICE_BUCKET_NAME}',
        rules: [
          {
            prefix: UPLOADED_PREFIX,
          },
        ],
        existing: true,
      },
    },
  ],
};
