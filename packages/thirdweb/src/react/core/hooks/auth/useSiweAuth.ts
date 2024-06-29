import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginPayload } from "../../../../auth/core/types.js";
import type { VerifyLoginPayloadParams } from "../../../../auth/core/verify-login-payload.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";

/**
 * Options for Setting up SIWE (Sign in with Ethereum) Authentication
 * @auth
 */
export type SiweAuthOptions = {
  // we pass address and chainId and retrieve a login payload (we do not care how)

  /**
   * Method to get the login payload for given address and chainId
   * @param params - The parameters to get the login payload for.
   */
  getLoginPayload: (params: {
    address: string;
    chainId: number;
  }) => Promise<LoginPayload>;

  // we pass the login payload and signature and the developer passes this to the auth server however they want

  /**
   * Method to login with the signed login payload
   * @param params
   */
  doLogin: (params: VerifyLoginPayloadParams) => Promise<void>;

  // we call this internally when a user explicitly disconnects their wallet

  /**
   * Method to logout the user
   */
  doLogout: () => Promise<void>;

  // the developer specifies how to check if the user is logged in, this is called internally by the component

  /**
   * Method to check if the user is logged in or not
   * @param address
   */
  isLoggedIn: (address: string) => Promise<boolean>;
};

/**
 * @internal
 */
export function useSiweAuth(
  activeWallet?: Wallet,
  authOptions?: SiweAuthOptions,
) {
  const activeAccount = activeWallet?.getAccount();

  const requiresAuth = !!authOptions;

  const queryClient = useQueryClient();

  const isLoggedInQuery = useQuery({
    queryKey: ["siwe_auth", "isLoggedIn", activeAccount?.address],
    enabled: requiresAuth && !!activeAccount?.address,
    queryFn: () => {
      // these cases should never be hit but just in case...
      if (!authOptions || !activeAccount?.address) {
        return false;
      }
      return authOptions.isLoggedIn(activeAccount.address);
    },
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      if (!authOptions) {
        throw new Error("No auth options provided");
      }

      if (!activeWallet) {
        throw new Error("No active wallet");
      }
      const chain = activeWallet.getChain();
      if (!chain) {
        throw new Error("No active chain");
      }
      if (!activeAccount) {
        throw new Error("No active account");
      }
      const [payload, { signLoginPayload }] = await Promise.all([
        authOptions.getLoginPayload({
          address: activeAccount.address,
          chainId: chain.id,
        }),
        // we lazy-load this because it's only needed when logging in
        import("../../../../auth/core/sign-login-payload.js"),
      ]);

      const signedPayload = await signLoginPayload({
        payload,
        account: activeAccount,
      });

      return await authOptions.doLogin(signedPayload);
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["siwe_auth", "isLoggedIn"],
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (!authOptions) {
        throw new Error("No auth options provided");
      }

      return await authOptions.doLogout();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["siwe_auth", "isLoggedIn"],
      });
    },
  });

  return {
    // is auth even enabled
    requiresAuth,

    // login
    doLogin: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    // logout
    doLogout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    // checking if logged in
    isLoggedIn: isLoggedInQuery.data,
    isLoading: isLoggedInQuery.isLoading,
  };
}
