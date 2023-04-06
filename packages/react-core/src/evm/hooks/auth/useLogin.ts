import { useWallet } from "../../../core/hooks/wallet-hooks";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  LoginOptions,
  LoginPayload,
  LoginPayloadData,
} from "@thirdweb-dev/auth";
import { GenericAuthWallet } from "@thirdweb-dev/wallets";
import invariant from "tiny-invariant";
import { AUTH_TOKEN_STORAGE_KEY } from "../../../core/constants/auth";

/**
 * Hook to securely login to a backend with the connected wallet. The backend
 * authentication URL must be configured on the ThirdwebProvider.
 *
 * @returns - A function to invoke to login with the connected wallet, and an isLoading state.
 *
 * @beta
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const authConfig = useThirdwebAuthContext();
  const wallet = useWallet();

  const login = useMutation({
    mutationFn: async (options?: LoginOptions) => {
      invariant(
        authConfig,
        "Please specify an authConfig in the ThirdwebProvider",
      );
      invariant(wallet, "You need a connected wallet to login.");
      invariant(
        authConfig.authUrl,
        "Please specify an authUrl in the authConfig.",
      );

      // we need to generate this auth payload

      const payload = await doLogin(wallet, {
        ...authConfig,
        ...(options || {}),
      });

      const res = await fetch(`${authConfig.authUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        throw new Error(`Login request failed with status code ${res.status}`);
      }

      const { token } = await res.json();
      await authConfig.secureStorage?.setItem(AUTH_TOKEN_STORAGE_KEY, token)

      queryClient.invalidateQueries(cacheKeys.auth.user());

      return token;
    },
  });

  return {
    login: (options?: LoginOptions) => login.mutateAsync(options),
    isLoading: login.isLoading,
  };
}

async function doLogin(
  wallet: GenericAuthWallet,
  options?: LoginOptions,
): Promise<LoginPayload> {
  let chainId: string | undefined = options?.chainId;
  if (!chainId && wallet.getChainId) {
    try {
      chainId = (await wallet.getChainId()).toString();
    } catch {
      // ignore error
    }
  }

  invariant(options?.domain, "Please specify a domain to login with.");
  // generate a pseudo-random nonce if none is provided
  const nonce =
    options?.nonce || Math.floor(Math.random() * 1000000000).toString();

  const payloadData: LoginPayloadData = {
    type: wallet.type,
    domain: options.domain,
    address: await wallet.getAddress(),
    statement:
      options?.statement ||
      "Please ensure that the domain above matches the URL of the current website.",
    version: options?.version || "1",
    uri: options?.uri,
    chain_id: chainId,
    nonce: options?.nonce || nonce,
    issued_at: new Date().toISOString(),
    expiration_time: new Date(
      options?.expirationTime || Date.now() + 1000 * 60 * 5,
    ).toISOString(),
    invalid_before: new Date(
      options?.invalidBefore || Date.now(),
    ).toISOString(),
    resources: options?.resources,
  };

  const signature = await wallet.signMessage(generateMessage(payloadData));

  return {
    payload: payloadData,
    signature,
  };
}

// generate straight from auth
function generateMessage(payload: LoginPayloadData): string {
  const typeField = payload.type === "evm" ? "Ethereum" : "Solana";
  const header = `${payload.domain} wants you to sign in with your ${typeField} account:`;
  let prefix = [header, payload.address].join("\n");
  prefix = [prefix, payload.statement].join("\n\n");
  if (payload.statement) {
    prefix += "\n";
  }

  const suffixArray = [];
  if (payload.uri) {
    const uriField = `URI: ${payload.uri}`;
    suffixArray.push(uriField);
  }

  const versionField = `Version: ${payload.version}`;
  suffixArray.push(versionField);

  if (payload.chain_id) {
    const chainField = `Chain ID: ` + payload.chain_id || "1";
    suffixArray.push(chainField);
  }

  const nonceField = `Nonce: ${payload.nonce}`;
  suffixArray.push(nonceField);

  const issuedAtField = `Issued At: ${payload.issued_at}`;
  suffixArray.push(issuedAtField);

  const expiryField = `Expiration Time: ${payload.expiration_time}`;
  suffixArray.push(expiryField);

  if (payload.invalid_before) {
    const invalidBeforeField = `Not Before: ${payload.invalid_before}`;
    suffixArray.push(invalidBeforeField);
  }

  if (payload.resources) {
    suffixArray.push(
      [`Resources:`, ...payload.resources.map((x) => `- ${x}`)].join("\n"),
    );
  }

  const suffix = suffixArray.join("\n");
  return [prefix, suffix].join("\n");
}
