import { getThirdwebBaseUrl } from "../../../../utils/domains.js";

const AUTH_SHARE_ID = 3;
export const AUTH_SHARE_INDEX = AUTH_SHARE_ID - 1;

const DEVICE_SHARE_ID = 1;
export const DEVICE_SHARE_INDEX = DEVICE_SHARE_ID - 1;
export const DEVICE_SHARE_MISSING_MESSAGE = "Missing device share.";
export const INVALID_DEVICE_SHARE_MESSAGE =
  "Invalid private key reconstructed from shares";

const RECOVERY_SHARE_ID = 2;
export const RECOVERY_SHARE_INDEX = RECOVERY_SHARE_ID - 1;

export const AWS_REGION = "us-west-2";

export const THIRDWEB_SESSION_NONCE_HEADER = "x-session-nonce";
const COGNITO_USER_POOL_ID = "us-west-2_UFwLcZIpq";
export const COGNITO_IDENTITY_POOL_ID =
  "us-west-2:2ad7ab1e-f48b-48a6-adfa-ac1090689c26";
export const GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION_V1 =
  "arn:aws:lambda:us-west-2:324457261097:function:recovery-share-password-GenerateRecoverySharePassw-bbE5ZbVAToil";
export const GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION_V2 =
  "arn:aws:lambda:us-west-2:324457261097:function:lambda-thirdweb-auth-enc-key-prod-ThirdwebAuthEncKeyFunction";
export const ENCLAVE_KMS_KEY_ARN =
  "arn:aws:kms:us-west-2:324457261097:key/ccfb9ecd-f45d-4f37-864a-25fe72dcb49e";

// TODO allow overriding domain
const DOMAIN_URL_2023 = getThirdwebBaseUrl("inAppWallet");
const BASE_URL_2023 = `${DOMAIN_URL_2023}/`;
const ROUTE_2023_10_20_API_BASE_PATH = `${BASE_URL_2023}api/2023-10-20`;
const ROUTE_2024_05_05_API_BASE_PATH = `${BASE_URL_2023}api/2024-05-05`;

export const ROUTE_EMBEDDED_WALLET_DETAILS = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/embedded-wallet-user-details`;
export const ROUTE_COGNITO_IDENTITY_POOL_URL = `cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;

export const ROUTE_STORE_USER_SHARES = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/embedded-wallet-shares`;
export const ROUTE_GET_USER_SHARES = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/embedded-wallet-shares`;
export const ROUTE_VERIFY_THIRDWEB_CLIENT_ID = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/verify-thirdweb-client-id`;
export const ROUTE_AUTH_JWT_CALLBACK = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/validate-custom-jwt`;
export const ROUTE_AUTH_ENDPOINT_CALLBACK = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/validate-custom-auth-endpoint`;

export const ROUTE_AUTH_COGNITO_ID_TOKEN_V1 = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/cognito-id-token`;
export const ROUTE_AUTH_COGNITO_ID_TOKEN_V2 = `${ROUTE_2024_05_05_API_BASE_PATH}/login/web-token-exchange`;
