import { Amplify, Auth } from "aws-amplify";
import crypto from "crypto";
import {
  AWS_REGION,
  COGNITO_APP_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from "../constants";

Amplify.configure({
  Auth: {
    region: AWS_REGION,
    userPoolId: COGNITO_USER_POOL_ID,
    userPoolWebClientId: COGNITO_APP_CLIENT_ID,
  },
});

export async function cognitoEmailSignUp(email: string, clientId: string) {
  console.log("cognito sign up email", email);
  await Auth.signUp({
    username: `${email}:email:${clientId}`,
    password: getRandomString(30),
    attributes: {
      email,
    },
  });
  await Auth.signOut();
}

function getRandomString(bytes: number) {
  const randomValues = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(randomValues).map(intToHex).join("");
}

function intToHex(nr: number) {
  return nr.toString(16).padStart(2, "0");
}

export async function cognitoEmailSignIn(email: string, clientId: string) {
  console.log("cognito sign in email", email);
  const cognitoUser = await Auth.signIn(`${email}:email:${clientId}`);
  return cognitoUser;
}
