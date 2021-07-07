export default {
  cognito: {
    REGION: 'us-east-2',
    USER_POOL_ID: 'REDACTED',
    APP_CLIENT_ID: 'REDACTED',
    IDENTITY_POOL_ID: 'REDACTED',
  },
  s3: {
    REGION: 'us-east-2',
    BUCKET: 'REDACTED',
  },
  apiGateway: {
    REGION: 'us-east-2',
    URL: process.env.NODE_ENV === 'development' ?
      'http://localhost:3000'
      : 'REDACTED',
  },
  MAX_ATTACHMENT_SIZE: 5000000, // 5MB
};
