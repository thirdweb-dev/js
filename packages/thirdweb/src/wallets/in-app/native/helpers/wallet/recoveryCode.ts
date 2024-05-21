import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { stringToBytes } from "../../../../../utils/encoding/to-bytes.js";
import { authFetchEmbeddedWalletUser } from "../api/fetchers.js";
import {
  AWS_REGION,
  COGNITO_IDENTITY_POOL_ID,
  GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION,
  ROUTE_AUTH_COGNITO_ID_TOKEN,
  ROUTE_COGNITO_IDENTITY_POOL_URL,
} from "../constants.js";

export async function getCognitoRecoveryPassword(client: ThirdwebClient) {
  const idTokenResponse = await authFetchEmbeddedWalletUser(
    client,
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
    Payload: stringToBytes(
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
  const encKeyResult = JSON.parse(data.Payload.transformToString());

  const result = JSON.parse(encKeyResult.body).recoveryShareEncKey as string;

  return result;
}
