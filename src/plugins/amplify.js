import Amplify from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import config from '../config';

// TODO call the configures separately so we can only import what is needed
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: 'coffee',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
        custom_header: async () => {
          return { Authorization: (await Auth.currentSession()).idToken.jwtToken };
        },
      },
    ],
  },
});
