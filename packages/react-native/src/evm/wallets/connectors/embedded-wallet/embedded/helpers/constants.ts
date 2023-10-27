export const AUTH_SHARE_ID = 3;
export const AUTH_SHARE_INDEX = AUTH_SHARE_ID - 1;
export const NO_EXISTING_WALLET_FOUND_FOR_USER =
  "User does not have an existing wallet. Create a wallet first";

export const DEVICE_SHARE_ID = 1;
export const DEVICE_SHARE_INDEX = DEVICE_SHARE_ID - 1;
export const DEVICE_SHARE_MISSING_MESSAGE = "Missing device share.";

export const RECOVERY_SHARE_ID = 2;
export const RECOVERY_SHARE_INDEX = RECOVERY_SHARE_ID - 1;

export const AWS_REGION = "us-west-2";

export const COGNITO_USER_POOL_ID = "us-west-2_UFwLcZIpq";
export const COGNITO_APP_CLIENT_ID = "2e02ha2ce6du13ldk8pai4h3d0";
export const COGNITO_IDENTITY_POOL_ID =
  "us-west-2:2ad7ab1e-f48b-48a6-adfa-ac1090689c26";
export const GENERATE_RECOVERY_PASSWORD_LAMBDA_FUNCTION =
  "arn:aws:lambda:us-west-2:324457261097:function:recovery-share-password-GenerateRecoverySharePassw-bbE5ZbVAToil";

const BASE_URL_2023 = "https://embedded-wallet.thirdweb.com/";
const ROUTE_2023_10_20_API_BASE_PATH = `${BASE_URL_2023}api/2023-10-20`;

export const ROUTE_GET_EMBEDDED_WALLET_DETAILS = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/embedded-wallet-user-details`;
export const ROUTE_VERIFY_COGNITO_OTP = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/validate-cognito-email-otp`;
export const ROUTE_COGNITO_IDENTITY_POOL_URL = `cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
export const ROUTE_STORE_USER_SHARES = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/embedded-wallet-shares`;
export const ROUTE_GET_USER_SHARES = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/embedded-wallet-shares`;
export const ROUTE_VERIFY_THIRDWEB_CLIENT_ID = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/verify-thirdweb-client-id`;
export const ROUTE_AUTH_JWT_CALLBACK = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/validate-custom-jwt`;

export const ROUTE_HEADLESS_GOOGLE_LOGIN = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/headless-oauth-login-link`;

export const ROUTE_AUTH_COGNITO_ID_TOKEN = `${ROUTE_2023_10_20_API_BASE_PATH}/embedded-wallet/cognito-id-token`;
