import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import {
  fromCognitoIdentity,
  fromCognitoIdentityPool,
} from "@aws-sdk/credential-providers";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { stringToBytes } from "../../../../../utils/encoding/to-bytes.js";
import { stringify } from "../../../../../utils/json.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
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

export async function getCognitoRecoveryPasswordV1(args: {
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}) {
  const idTokenResponse = await authFetchEmbeddedWalletUser({
    client: args.client,
    props: {
      method: "GET",
    },
    storage: args.storage,
    url: ROUTE_AUTH_COGNITO_ID_TOKEN_V1,
  });
  if (!idTokenResponse.ok) {
    throw new Error(
      `Failed to fetch id token from Cognito: ${stringify(
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
    credentials: credentials,
    region: AWS_REGION,
  });

  const params = {
    FunctionName: GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION_V1,
    Payload: stringToBytes(
      stringify({
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

export async function getCognitoRecoveryPasswordV2(args: {
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}) {
  const idTokenResponse = await authFetchEmbeddedWalletUser({
    client: args.client,
    props: {
      method: "GET",
    },
    storage: args.storage,
    url: ROUTE_AUTH_COGNITO_ID_TOKEN_V2,
  });
  if (!idTokenResponse.ok) {
    throw new Error(
      `Failed to fetch id token from Cognito: ${stringify(
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
    credentials: cognitoIdentity,
    region: AWS_REGION,
  });

  const params = {
    FunctionName: GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION_V2,
    Payload: stringToBytes(
      stringify({
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
