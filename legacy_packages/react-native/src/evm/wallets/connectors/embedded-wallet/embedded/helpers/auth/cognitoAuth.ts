import { Amplify, Auth } from "aws-amplify";
import {
  AWS_REGION,
  COGNITO_APP_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from "../constants";
import { getRandomString } from "../getRandomValues";

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
    password: getRandomString(30),
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
