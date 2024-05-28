import type { CognitoUser } from "amazon-cognito-identity-js";
import { Amplify, Auth } from "aws-amplify";
import { randomBytesHex } from "../../../../../utils/random.js";
import {
  AWS_REGION,
  COGNITO_APP_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from "../constants.js";

Amplify.configure({
  Auth: {
    region: AWS_REGION,
    userPoolId: COGNITO_USER_POOL_ID,
    userPoolWebClientId: COGNITO_APP_CLIENT_ID,
  },
});

export async function cognitoEmailSignUp(email: string, clientId: string) {
  await Auth.signUp({
    username: `${email}:email:${clientId}`,
    password: randomBytesHex(30),
    attributes: {
      email,
    },
  });
  await Auth.signOut();
}

export async function cognitoEmailSignIn(email: string, clientId: string) {
  const cognitoUser = await Auth.signIn(`${email}:email:${clientId}`);
  return cognitoUser;
}

export async function cognitoPhoneSignIn(
  phoneNumber: string,
  clientId: string,
) {
  const cognitoUser = (await Auth.signIn(
    `${phoneNumber}:sms:${clientId}`,
  )) as CognitoUser;
  return cognitoUser;
}

export async function cognitoPhoneSignUp(
  phoneNumber: string,
  clientId: string,
) {
  await Auth.signUp({
    username: `${phoneNumber}:sms:${clientId}`,
    password: randomBytesHex(30),
    attributes: {
      // ! This is a placeholder email, it will not be used for anything. We simply need this to satisfy the Cognito API.
      email: "cognito@thirdweb.com",
    },
  });
  await Auth.signOut();
}
