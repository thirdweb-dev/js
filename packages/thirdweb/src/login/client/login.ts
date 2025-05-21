import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { getAddress } from "../../utils/address.js";
import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import { inAppWallet } from "../../wallets/in-app/web/in-app.js";
import type { Account, Wallet } from "../../wallets/interfaces/wallet.js";
import type { AuthOption } from "../../wallets/types.js";
import type { AuthRouter } from "../server/auth-handler.js";

export type LoginOptions = (
  | {
      type: "email";
      email: string;
    }
  | {
      type: "phone";
      phoneNumber: string;
    }
  | {
      type: Exclude<AuthOption, "email" | "phone" | "wallet" | "jwt">;
    }
  | {
      type: "wallet";
      wallet: Wallet;
      chain: Chain;
    }
  | {
      type: "jwt";
      jwt: string;
    }
) & {
  client: ThirdwebClient;
  chain: Chain;
  options?: {
    sponsorGas?: boolean;
    redirectUrl?: string;
    passkeyDomain?: string;
    storage?: AsyncStorage;
  };
  baseURL?: string;
};

export type LoginResult = Awaited<ReturnType<typeof login>>;

export async function login(loginOptions: LoginOptions) {
  const IAW = inAppWallet({
    auth: {
      mode: "popup",
      options: [],
      redirectUrl: loginOptions.options?.redirectUrl,
      passkeyDomain: loginOptions.options?.passkeyDomain,
    },
    storage: loginOptions.options?.storage,
    executionMode: {
      mode: "EIP7702",
      sponsorGas: loginOptions.options?.sponsorGas,
    },
  });

  switch (loginOptions.type) {
    // jwt login
    case "jwt": {
      const account = await IAW.connect({
        client: loginOptions.client,
        strategy: "jwt",
        jwt: loginOptions.jwt,
        chain: loginOptions.chain,
      });

      return mapAccount(account, IAW, loginOptions.baseURL);
    }
    // phone login
    case "phone": {
      // send the SMS
      const { preAuthenticate } = await import(
        "../../wallets/in-app/web/lib/auth/index.js"
      );
      await preAuthenticate({
        phoneNumber: loginOptions.phoneNumber,
        strategy: "phone",
        client: loginOptions.client,
      });

      // return the OTP verification code step
      return {
        status: "requires_otp" as const,
        verifyOtp: async (verificationCode: string) => {
          const account = await IAW.connect({
            strategy: "phone",
            phoneNumber: loginOptions.phoneNumber,
            verificationCode,
            client: loginOptions.client,
            chain: loginOptions.chain,
          });

          return mapAccount(account, IAW, loginOptions.baseURL);
        },
      };
    }

    // email login
    case "email": {
      // send the email
      const { preAuthenticate } = await import(
        "../../wallets/in-app/web/lib/auth/index.js"
      );
      await preAuthenticate({
        email: loginOptions.email,
        strategy: "email",
        client: loginOptions.client,
      });

      // return the OTP verification code step
      return {
        status: "requires_otp" as const,
        verifyOtp: async (verificationCode: string) => {
          const account = await IAW.connect({
            strategy: "email",
            email: loginOptions.email,
            verificationCode,
            client: loginOptions.client,
            chain: loginOptions.chain,
          });

          return mapAccount(account, IAW, loginOptions.baseURL);
        },
      };
    }

    // wallet login
    case "wallet": {
      const account = await IAW.connect({
        client: loginOptions.client,
        strategy: "wallet",
        wallet: loginOptions.wallet,
        chain: loginOptions.chain,
      });

      return mapAccount(account, IAW, loginOptions.baseURL);
    }

    default: {
      // all social login options are handled here (google, apple, etc)
      const { isSocialAuthOption } = await import("../../wallets/types.js");
      if (isSocialAuthOption(loginOptions.type)) {
        const account = await IAW.connect({
          client: loginOptions.client,
          strategy: loginOptions.type,
          chain: loginOptions.chain,
        });

        return mapAccount(account, IAW, loginOptions.baseURL);
      }

      throw new Error(`Invalid login type: ${loginOptions.type}`);
    }
  }
}

function mapAccount(
  account: Account,
  IAW: Wallet<"inApp">,
  baseURL: string | undefined,
) {
  let jwt_cache:
    | {
        jwt: string;
        expiresAt: Date;
      }
    | undefined;

  return {
    status: "authenticated" as const,
    id: account.address as `0x${string}`,

    // actions
    logout: async () => {
      // remove the JWT from the local state
      jwt_cache = undefined;
      // if we have a phetch client, call the logout endpoint
      if (baseURL) {
        const { createClient } = await import("better-call/client");
        await createClient<AuthRouter>({ baseURL })("@post/logout", {
          method: "POST",
        });
      }
    },
    getJWT: async () => {
      // if we have a cached JWT that is still valid, simply return it
      if (jwt_cache && jwt_cache.expiresAt > new Date()) {
        return jwt_cache.jwt;
      }

      if (!baseURL) {
        throw new Error("baseURL is required to retrieve a JWT");
      }

      const { createClient } = await import("better-call/client");
      const authClient = createClient<AuthRouter>({ baseURL });

      // 1. check if the user's existing JWT is still valid (if we have one)
      const { data, error } = await authClient("/is-logged-in", {
        // if we have a JWT "locally", use it to authenticate
        // if we do NOT have it we automatically fall back to cookies
        auth: jwt_cache?.jwt
          ? {
              type: "Bearer",
              token: jwt_cache.jwt,
            }
          : undefined,
      });
      // if the JWT is valid, we can simply return it
      if (
        data?.address &&
        getAddress(data.address) === getAddress(account.address)
      ) {
        // set the JWT in the local state
        jwt_cache = {
          jwt: data.jwt,
          expiresAt: new Date(data.expiresAt),
        };
        // return the JWT
        return data.jwt;
      }

      if (error) {
        // if we get an error, log it for debugging
        console.error(
          "Failed to check if user is logged in, continuing to generate a new JWT",
          error,
        );
      }

      // otherwise, we'll continue since we need to generate a new JWT

      // 2. if we got this far, we need to generate a new JWT
      const payloadResponse = await authClient("/payload", {
        query: {
          address: account.address,
          chainId: IAW.getChain()?.id,
        },
      });
      if (payloadResponse.error) {
        throw new Error("Failed to generate payload during login", {
          cause: new Error(
            payloadResponse.error.message || payloadResponse.error.statusText,
          ),
        });
      }

      // 3. sign the login payload
      const { signLoginPayload } = await import(
        "../../auth/core/sign-login-payload.js"
      );
      const result = await signLoginPayload({
        payload: payloadResponse.data,
        account,
      });

      // 4. generate a JWT
      const loginResponse = await authClient("@post/login", {
        body: result,
      });

      if (loginResponse.error) {
        throw new Error("Failed to login", {
          cause: new Error(
            loginResponse.error.message || loginResponse.error.statusText,
          ),
        });
      }

      // set the jwt cache
      jwt_cache = {
        jwt: loginResponse.data.jwt,
        expiresAt: new Date(loginResponse.data.expiresAt),
      };
      return loginResponse.data.jwt;
    },

    // signature based actions
    sendTransaction: async (transaction: PreparedTransaction) => {
      const { sendTransaction } = await import(
        "../../transaction/actions/send-transaction.js"
      );
      return sendTransaction({
        account,
        transaction,
      });
    },
    sendBatchTransaction: async (transactions: PreparedTransaction[]) => {
      const { sendBatchTransaction } = await import(
        "../../transaction/actions/send-batch-transaction.js"
      );
      return sendBatchTransaction({
        account,
        transactions,
      });
    },
    signMessage: account.signMessage,
    signTypedData: account.signTypedData,
  };
}
