import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "./authToken";
import { isNebulaAuthTokenValid } from "./isAuthTokenValid";

export async function getNebulaLoginStatus(): Promise<
  | {
      isLoggedIn: false;
    }
  | {
      isLoggedIn: true;
      authToken: string;
      accountAddress: string;
    }
> {
  const [authToken, accountAddress] = await Promise.all([
    getNebulaAuthToken(),
    getNebulaAuthTokenWalletAddress(),
  ]);

  if (!authToken || !accountAddress) {
    return {
      isLoggedIn: false,
    };
  }

  const isValidAuthToken = await isNebulaAuthTokenValid(authToken);

  if (!isValidAuthToken) {
    return {
      isLoggedIn: false,
    };
  }

  return {
    accountAddress,
    authToken,
    isLoggedIn: true,
  };
}
