import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import {
  fromCognitoIdentity,
  fromCognitoIdentityPool,
} from "@aws-sdk/credential-providers";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { stringToBytes } from "../../../../../utils/encoding/to-bytes.js";
import { authFetchEmbeddedWalletUser } from "../api/fetchers.js";
import {
  AWS_REGION,
  COGNITO_IDENTITY_POOL_ID,
  GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION_V1,
  GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION_V2,
  ROUTE_AUTH_COGNITO_ID_TOKEN_V1,
  ROUTE_AUTH_COGNITO_ID_TOKEN_V2,
  ROUTE_COGNITO_IDENTITY_POOL_URL,
} from "../constants.js";

export async function getCognitoRecoveryPasswordV1(client: ThirdwebClient) {
  const idTokenResponse = await authFetchEmbeddedWalletUser(
    client,
    ROUTE_AUTH_COGNITO_ID_TOKEN_V1,
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

  const params = {
    FunctionName: GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION_V1,
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

export async function getCognitoRecoveryPasswordV2(client: ThirdwebClient) {
  const idTokenResponse = await authFetchEmbeddedWalletUser(
    client,
    ROUTE_AUTH_COGNITO_ID_TOKEN_V2,
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
  const { token, identityId, lambdaToken } = idTokenResult;

  const cognitoIdentity = fromCognitoIdentity({
    clientConfig: {
      region: AWS_REGION,
    },
    identityId,
    logins: {
      "cognito-identity.amazonaws.com": token,
    },
  });

  // ? Figure out how to potentially route things through API Gateway
  const lambdaClient = new LambdaClient({
    region: AWS_REGION,
    credentials: cognitoIdentity,
  });

  const params = {
    FunctionName: GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION_V2,
    Payload: stringToBytes(
      JSON.stringify({
        token: lambdaToken,
      }),
    ),
  };

  const data = await lambdaClient.send(new InvokeCommand(params));

  if (!data.Payload) {
    throw new Error("No payload");
  }
  const encKeyResult = JSON.parse(data.Payload.transformToString());

  if (encKeyResult.statusCode !== 200) {
    throw new Error(
      "Failed to get recovery code",
      JSON.parse(encKeyResult.body).message,
    );
  }

  return (JSON.parse(encKeyResult.body) as { recoveryShareEncKey: string })
    .recoveryShareEncKey;
}
export const getCognitoRecoveryPassword = getCognitoRecoveryPasswordV2;
