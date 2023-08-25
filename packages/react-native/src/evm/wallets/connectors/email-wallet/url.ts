export const AWS_REGION = 'us-west-2';
export const PAPER_BASE_PATH =
  process.env.NEXT_PUBLIC_NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_NODE_ENV === 'staging'
    ? `https://${process.env.ZEET_DEPLOYMENT_URL}`
    : 'https://withpaper.com';

export const ROUTE_2022_08_12_API_BASE_PATH =
  'https://withpaper.com/api/2022-08-12';
export const ROUTE_SEND_OTP = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/send-otp`;
export const ROUTE_GET_EMBEDDED_WALLET_DETAILS = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/user-wallet-details`;
export const ROUTE_INIT_RECOVERY_CODE_FREE_WALLET = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/init-recovery-code-free-wallet`;
export const ROUTE_SEND_RECOVERY_CODE = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/send-recovery-code`;
export const ROUTE_AUTH_COGNITO_ID_TOKEN = `${ROUTE_2022_08_12_API_BASE_PATH}/embedded-wallet/cognito-id-token`;
export const ROUTE_COGNITO_IDENTITY_POOL_URL = `cognito-idp.${AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`;

/**
 * Returns an absolute URL string given the provided path and query params.
 *
 * @param path - A relative or absolute path. If relative, window.location.origin or PAPER_BASE_PATH is used as the hostname.
 * @param queryParams - Optional. A map of query params. Undefined values are ommitted.
 * @returns string
 */
export const getAbsoluteUrl = (
  path: string,
  queryParams?: Record<string, string | number | boolean | undefined>,
): string => {
  // Hostname is set to the current page's origin (e.g. papercheckout.com or custom DNS) or the default Paper domain depending on the environment.
  // Hostname is ignored for absolute paths.
  const hostname = PAPER_BASE_PATH;
  const url = new URL(path, hostname);

  if (queryParams) {
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v !== undefined) {
        url.searchParams.set(k, v.toString());
      }
    });
  }
  return url.href;
};
