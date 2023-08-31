import { Amplify, Auth } from "aws-amplify";
import {
  AWS_REGION,
  COGNITO_APP_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from "../constants";
import { getRandomValues } from "../getRandomValues";

Amplify.configure({
  Auth: {
    region: AWS_REGION,
    userPoolId: COGNITO_USER_POOL_ID,
    userPoolWebClientId: COGNITO_APP_CLIENT_ID,
  },
});

export async function cognitoEmailSignUp(email: string, clientId: string) {
  console.log("cognito sign up email", email, clientId);
  console.log("Auth", Auth.signUp);
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
  const randomValues = getRandomValues(new Uint8Array(bytes));
  return Array.from(randomValues)
    .map((nr) => nr.toString(16).padStart(2, "0"))
    .join("");
}

export async function cognitoEmailSignIn(email: string, clientId: string) {
  console.log("cognito sign in email", email);
  const cognitoUser = await Auth.signIn(`${email}:email:${clientId}`);
  return cognitoUser;
}
