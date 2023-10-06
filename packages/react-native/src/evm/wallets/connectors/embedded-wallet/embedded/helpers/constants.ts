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

const BASE_URL = "https://ews.thirdweb.com";
const ROUTE_2022_08_12_API_BASE_PATH = `${BASE_URL}/api/2022-08-12`;

export const ROUTE_GET_EMBEDDED_WALLET_DETAILS = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/user-wallet-details`;
export const ROUTE_VERIFY_COGNITO_OTP = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/verify-cognito-otp`;
export const ROUTE_COGNITO_IDENTITY_POOL_URL = `cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
export const ROUTE_INIT_RECOVERY_CODE_FREE_WALLET = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/init-recovery-code-free-wallet`;
export const ROUTE_STORE_USER_SHARES = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/store-shares`;
export const ROUTE_GET_USER_SHARES = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/get-shares`;
export const ROUTE_VERIFY_THIRDWEB_CLIENT_ID = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/verify-thirdweb-client-id`;

export const ROUTE_HEADLESS_GOOGLE_LOGIN_REDIRECT = `${BASE_URL}/sdk/2022-08-12/embedded-wallet/auth/headless-google-login-managed-redirect`;

export const ROUTE_AUTH_COGNITO_ID_TOKEN = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/cognito-id-token`;
