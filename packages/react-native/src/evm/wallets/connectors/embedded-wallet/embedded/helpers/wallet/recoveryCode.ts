import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { stringToUint8Array, uint8ArrayToString } from "uint8array-extras";

import { authFetchEmbeddedWalletUser } from "../api/fetchers";
import {
  AWS_REGION,
  COGNITO_IDENTITY_POOL_ID,
  GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION,
  ROUTE_AUTH_COGNITO_ID_TOKEN,
  ROUTE_COGNITO_IDENTITY_POOL_URL,
} from "../constants";

export async function getCognitoRecoveryPassword(clientId: string) {
  const idTokenResponse = await authFetchEmbeddedWalletUser(
    { clientId },
    ROUTE_AUTH_COGNITO_ID_TOKEN,
    {
      method: "GET",
    },
  );
  if (!idTokenResponse.ok) {
    throw new Error(
      `Failed to fetch id token from Cognito: ${JSON.stringify(
        await idTokenResponse.json(),
        null,
        2,
      )}`,
    );
  }
  const idTokenResult = await idTokenResponse.json();
  const { idToken, accessToken } = idTokenResult;

  const cognitoIdentity = fromCognitoIdentityPool({
    clientConfig: {
      region: AWS_REGION,
    },
    identityPoolId: COGNITO_IDENTITY_POOL_ID,
    logins: {
      [ROUTE_COGNITO_IDENTITY_POOL_URL]: idToken,
    },
  });
  const credentials = await cognitoIdentity();

  // ? Figure out how to potentially route things through API Gateway
  const lambdaClient = new LambdaClient({
    region: AWS_REGION,
    credentials: credentials,
  });

  const functionName = GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION;

  const params = {
    FunctionName: functionName,
    Payload: stringToUint8Array(
      JSON.stringify({
        accessToken,
        idToken,
      }),
    ),
  };
  const data = await lambdaClient.send(new InvokeCommand(params));
  if (!data.Payload) {
    throw new Error("No payload");
  }
  const encKeyResult = JSON.parse(uint8ArrayToString(data.Payload));

  const result = JSON.parse(encKeyResult.body).recoveryShareEncKey as string;

  return result;
}
