import { Amplify, Auth } from "aws-amplify";
import crypto from "crypto";

Amplify.configure({
  Auth: {
    region: "us-west-2",
    userPoolId: "us-west-2_UFwLcZIpq",
    userPoolWebClientId: "2e02ha2ce6du13ldk8pai4h3d0",
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
