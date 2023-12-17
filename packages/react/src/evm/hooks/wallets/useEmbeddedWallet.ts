import {
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
  useWallet,
  useWalletContext,
  useWallets,
} from "@thirdweb-dev/react-core";
import {
  walletIds,
  type AuthParams,
  EmbeddedWallet,
} from "@thirdweb-dev/wallets";
import { useCallback, useEffect } from "react";
import { embeddedWallet } from "../../../wallet/wallets/embeddedWallet/embeddedWallet";
import {
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * Hook to connect `EmbeddedWallet` which allows users to login via Email or social logins
 *
 * The `embeddedWallet()` should be added to `ThirdwebProvider`'s `supportedWallets` prop to enable auto-connection on page load
 *
 * @example
 *
 * ### Social Login
 *
 * ```jsx
 * import { useEmbeddedWallet } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { connect } = useEmbeddedWallet();
 *
 *   const handleLogin = async () => {
 *     await connect({
 *       strategy: "google",
 *     });
 *   };
 *
 *   return <button onClick={handleLogin}> Sign in with Google </button>;
 * }
 * ```
 *
 *
 * ### Login with Email verification
 *
 * ```tsx
 * import { useEmbeddedWallet } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { connect, sendVerificationEmail } = useEmbeddedWallet();
 *
 *   const sendVerificationCode = async (email: string) => {
 *     // send email verification code
 *     await sendVerificationEmail({ email });
 *   };
 *
 *   const handleLogin = async (email: string, verificationCode: string) => {
 *     // verify email and connect
 *     await connect({
 *       strategy: "email_verification",
 *       email,
 *       verificationCode,
 *     });
 *   };
 *
 *   return <div> ... </div>;
 * }
 * ```
 *
 *
 * ### Available connection strategies
 *
 * ```tsx
 * // email verification
 * type EmailVerificationAuthParams = {
 *   strategy: "email_verification";
 *   email: string;
 *   verificationCode: string;
 *   recoveryCode?: string;
 * };
 *
 * export type EmbeddedWalletOauthStrategy = "google" | "apple" | "facebook";
 *
 * type OauthAuthParams = {
 *   strategy: EmbeddedWalletOauthStrategy;
 *   openedWindow?: Window;
 *   closeOpenedWindow?: (window: Window) => void;
 * };
 *
 * // bring your own authentication
 * type JwtAuthParams = {
 *   strategy: "jwt";
 *   jwt: string;
 *   encryptionKey?: string;
 * };
 *
 * // open iframe to send and input the verification code only
 * type IframeOtpAuthParams = {
 *   strategy: "iframe_email_verification";
 *   email: string;
 * };
 *
 * // open iframe to enter email and verification code
 * type IframeAuthParams = {
 *   strategy: "iframe";
 * };
 * ```
 *
 * @walletConnection
 */
export function useEmbeddedWallet() {
  const create = useCreateWalletInstance();
  const setStatus = useSetConnectionStatus();
  const setWallet = useSetConnectedWallet();
  const context = useWalletContext();
  const wallets = useWallets();

  const connect = useCallback(
    async (authParams: AuthParams) => {
      setStatus("connecting");
      const config = wallets.find((w) => w.id === walletIds.embeddedWallet);
      if (
        !config ||
        (config.personalWallets && config.personalWallets.length > 0)
      ) {
        console.warn(
          "Embedded wallet not configured in ThirdwebProvider.supportedWallets - add it to enable autoconnect on page load",
        );
      }
      const wallet = create(embeddedWallet());
      try {
        const authResult = await wallet.authenticate(authParams);
        await wallet.connect({ authResult });
        setWallet(wallet);
        setStatus("connected");
      } catch (e) {
        console.error("Error connecting to embedded wallet", e);
        setStatus("disconnected");
        throw e;
      }
      return wallet;
    },
    [setStatus, wallets, create, setWallet],
  );

  const sendVerificationEmail = useCallback(
    async ({ email }: { email: string }) => {
      const clientId = context.clientId;
      if (!clientId) {
        throw new Error(
          "clientId not found, please add it to ThirdwebProvider",
        );
      }
      return EmbeddedWallet.sendVerificationEmail({
        email,
        clientId,
      });
    },
    [context],
  );

  return {
    connect,
    sendVerificationEmail,
  };
}

/**
 * Hook to get the user's email from connected `EmbeddedWallet`
 *
 * @example
 * ```ts
 * const emailQuery = useEmbeddedWalletUserEmail();
 *
 * if (emailQuery.isFetching) {
 *  return <div> Loading... </div>;
 * }
 *
 * if (emailQuery.data) {
 *  return <div> Connected with {emailQuery.data} </div>;
 * }
 *
 * return <div> Not connected </div>;
 * ```
 *
 * @connectWallet
 * @returns Hook's `data` property contains the `string` email if `EmbeddedWallet` is connected, otherwise `undefined`
 */
export function useEmbeddedWalletUserEmail(): UseQueryResult<
  string | undefined
> {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  const emailQuery = useQuery<string | undefined, string>(
    [wallet?.walletId, "embeddedWallet-email"],
    () => {
      if (wallet && wallet.walletId === walletIds.embeddedWallet) {
        return (wallet as EmbeddedWallet).getEmail();
      }
    },
    {
      retry: false,
      enabled: wallet?.walletId === walletIds.embeddedWallet,
    },
  );

  // Invalidate the query when the wallet changes
  useEffect(() => {
    queryClient.invalidateQueries([wallet?.walletId, "embeddedWallet-email"]);
  }, [wallet, queryClient]);

  return emailQuery;
}
