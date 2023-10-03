import type { ChainOrRpcUrl, NetworkInput } from "../core/types";
import { isProvider, isSigner } from "../functions/getSignerAndProvider";
import { StaticJsonRpcBatchProvider } from "../lib/static-batch-rpc";
import type { SDKOptions, SDKOptionsOutput } from "../schema/sdk-options";
import { SDKOptionsSchema } from "../schema/sdk-options";
import type { ChainInfo } from "../schema/shared/ChainInfo";
import { getValidChainRPCs } from "@thirdweb-dev/chains";
import type { Chain } from "@thirdweb-dev/chains";
import { providers } from "ethers";
import type { Signer } from "ethers";
import pkg from "../../../package.json";
import { isBrowser } from "@thirdweb-dev/storage";

/**
 * @internal
 */
function buildDefaultMap(options: SDKOptionsOutput) {
  return options.supportedChains.reduce(
    (previousValue, currentValue) => {
      previousValue[currentValue.chainId] = currentValue;
      return previousValue;
    },
    {} as Record<number, ChainInfo>,
  );
}

/**
 * Get an ethers provider for the specified network
 *
 * @internal
 */
export function getChainProvider(
  network: ChainOrRpcUrl,
  sdkOptions: SDKOptions,
): providers.Provider {
  // If we have an RPC URL, use that for the provider
  if (typeof network === "string" && isRpcUrl(network)) {
    return getProviderFromRpcUrl(network, sdkOptions);
  }

  // Add the chain to the supportedChains
  const options = SDKOptionsSchema.parse(sdkOptions);
  if (isChainConfig(network)) {
    options.supportedChains = [
      // @ts-expect-error - we know this is a chain and it will work to build the map
      network,
      ...options.supportedChains.filter((c) => c.chainId !== network.chainId),
    ];
  }

  // Build a map of chainId -> ChainInfo based on the supportedChains
  const rpcMap: Record<number, ChainInfo> = buildDefaultMap(options);

  let rpcUrl = "";
  let chainId;
  try {
    // Resolve the chain id from the network, which could be a chain, chain name, or chain id
    chainId = getChainIdFromNetwork(network, options);
    // Attempt to get the RPC url from the map based on the chainId
    rpcUrl = getValidChainRPCs(rpcMap[chainId], options.clientId)[0];
  } catch (e) {
    // no-op
  }

  // if we still don't have an url fall back to just using the chainId or slug in the rpc and try that
  if (!rpcUrl) {
    rpcUrl = `https://${chainId || network}.rpc.thirdweb.com/${
      options.clientId || ""
    }`;
  }

  if (!rpcUrl) {
    throw new Error(
      `No rpc url found for chain ${network}. Please provide a valid rpc url via the 'supportedChains' property of the sdk options.`,
    );
  }

  return getProviderFromRpcUrl(rpcUrl, sdkOptions, chainId);
}

export function getChainIdFromNetwork(
  network: ChainOrRpcUrl,
  options: SDKOptionsOutput,
): number {
  if (isChainConfig(network)) {
    // If it's a chain just return the chain id
    return network.chainId;
  } else if (typeof network === "number") {
    // If it's a number (chainId) return it directly
    return network;
  } else {
    // If it's a string (chain name) return the chain id from the map
    const chainNameToId = options.supportedChains.reduce(
      (acc, curr) => {
        acc[curr.slug] = curr.chainId;
        return acc;
      },
      {} as Record<string, number>,
    );

    if (network in chainNameToId) {
      return chainNameToId[network];
    }
  }

  throw new Error(
    `Cannot resolve chainId from: ${network} - please pass the chainId instead and specify it in the 'supportedChains' property of the SDK options.`,
  );
}

export async function getChainIdOrName(
  network: NetworkInput,
): Promise<number | string> {
  if (isChainConfig(network)) {
    // If it's a chain just return the chain id
    return network.chainId;
  } else if (typeof network === "number") {
    // If it's a number (chainId) return it directly
    return network;
  } else if (typeof network === "number") {
    // If it's a string (chain name) return the chain id from the map
    return network;
  } else if (isProvider(network)) {
    return network.getNetwork().then((n) => n.chainId);
  } else if (isSigner(network)) {
    if (!network.provider) {
      throw new Error("Signer does not have a provider");
    }
    return network.provider.getNetwork().then((n) => n.chainId);
  }
  throw new Error(`Cannot resolve chainId from: ${network}.`);
}

/**
 * Check whether a NetworkInput value is a Chain config (naively, without parsing)
 */
export function isChainConfig(
  network: NetworkInput,
): network is Chain | ChainInfo {
  return (
    typeof network !== "string" &&
    typeof network !== "number" &&
    !isSigner(network) &&
    !isProvider(network)
  );
}

/**
 * Returns whether the specified url is a valid RPC url, as implemented by ethers.getDefaultProvier():
 * - https://github.com/ethers-io/ethers.js/blob/ec1b9583039a14a0e0fa15d0a2a6082a2f41cf5b/packages/providers/src.ts/index.ts#L55
 *
 * @param url - The url to check
 *
 * @internal
 */
function isRpcUrl(url: string): boolean {
  const match = url.match(/^(ws|http)s?:/i);
  if (match) {
    switch (match[1].toLowerCase()) {
      case "http":
      case "https":
      case "ws":
      case "wss":
        return true;
    }
  }

  return false;
}

const RPC_PROVIDER_MAP: Map<
  string,
  StaticJsonRpcBatchProvider | providers.JsonRpcBatchProvider
> = new Map();

/**
 * Get an ethers provider based on the specified RPC URL
 *
 * @param rpcUrl - The RPC URL
 * @param chainId - The optional chain ID
 * @returns The provider for the specified RPC URL
 *
 * @internal
 */
export function getProviderFromRpcUrl(
  rpcUrl: string,
  sdkOptions: SDKOptions,
  chainId?: number,
) {
  try {
    const headers: HeadersInit = {};
    // will be used to make sure we don't cache providers with different auth strategies
    let authStrategy = "none";

    if (isTwUrl(rpcUrl)) {
      // if we have a secret key passed in the SDK options we want to always use that
      if (sdkOptions?.secretKey) {
        // compute the clientId from the secret key
        // should only be used on Node.js in a backend/script context
        if (typeof window !== "undefined") {
          throw new Error("Cannot use secretKey in browser context");
        }
        // this is on purpose because we're using the crypto module only in node
        // try to trick webpack :)
        const pto = "pto";
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const crypto = require("cry" + pto);
        const hashedSecretKey = crypto
          .createHash("sha256")
          .update(sdkOptions.secretKey)
          .digest("hex");
        const derivedClientId = hashedSecretKey.slice(0, 32);
        const utilizedRpcUrl = new URL(rpcUrl);
        // always set the clientId on the path to the derived client id
        utilizedRpcUrl.pathname = derivedClientId;
        // set the headers
        headers["x-client-id"] = derivedClientId;
        headers["x-secret-key"] = sdkOptions.secretKey;
        // set the final rpc url
        rpcUrl = utilizedRpcUrl.toString();
        authStrategy = "secretKey";
      }
      // if we do NOT have a secret key but we have a client id we want to use that
      else if (sdkOptions?.clientId) {
        const utilizedRpcUrl = new URL(rpcUrl);
        // always set the clientId on the path to the client id
        utilizedRpcUrl.pathname = sdkOptions.clientId;
        // set the headers
        headers["x-client-id"] = sdkOptions.clientId;
        // set the final rpc url
        rpcUrl = utilizedRpcUrl.toString();
        authStrategy = "clientId";
      }

      // if we *also* have a tw auth token on global context add it to the headers (in addition to anything else)
      if (
        typeof globalThis !== "undefined" &&
        "TW_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_AUTH_TOKEN === "string"
      ) {
        headers["authorization"] = `Bearer ${
          (globalThis as any).TW_AUTH_TOKEN as string
        }`;
        authStrategy = "twAuthToken";
      }

      if (
        typeof globalThis !== "undefined" &&
        "TW_CLI_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string"
      ) {
        headers["x-authorize-wallet"] = "true";
      }

      const bundleId =
        typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
          ? ((globalThis as any).APP_BUNDLE_ID as string)
          : undefined;
      if (!rpcUrl.includes("bundleId")) {
        rpcUrl = rpcUrl + (bundleId ? `?bundleId=${bundleId}` : "");
      }

      headers["x-sdk-version"] = pkg.version;
      headers["x-sdk-name"] = pkg.name;
      headers["x-sdk-platform"] = bundleId
        ? "react-native"
        : isBrowser()
        ? (window as any).bridge !== undefined
          ? "webGL"
          : "browser"
        : "node";
    }
    const match = rpcUrl.match(/^(ws|http)s?:/i);
    // Try the JSON batch provider if available
    if (match) {
      switch (match[1].toLowerCase()) {
        case "http":
        case "https":
          // Create a unique cache key for these params
          const seralizedOpts = `${rpcUrl}-${chainId || -1}-${authStrategy}`;

          // Check if we have a provider in our cache already
          const existingProvider = RPC_PROVIDER_MAP.get(seralizedOpts);
          if (existingProvider) {
            return existingProvider;
          }

          // Otherwise, create a new provider on the specific network
          const newProvider = chainId
            ? // If we know the chainId we should use the StaticJsonRpcBatchProvider
              new StaticJsonRpcBatchProvider(
                {
                  url: rpcUrl,
                  headers,
                },
                chainId,
              )
            : // Otherwise fall back to the built in json rpc batch provider
              new providers.JsonRpcBatchProvider({
                url: rpcUrl,
                headers,
              });

          // Save the provider in our cache
          RPC_PROVIDER_MAP.set(seralizedOpts, newProvider);
          return newProvider;
        case "ws":
        case "wss":
          // Use the WebSocketProvider for ws:// URLs
          // TODO: handle auth for WS at some point
          return new providers.WebSocketProvider(rpcUrl, chainId);
      }
    }
  } catch (e) {
    // no-op
  }

  // Always fallback to the default provider if no other option worked
  return providers.getDefaultProvider(rpcUrl);
}

// TODO move to utils package
function isTwUrl(url: string): boolean {
  return new URL(url).hostname.endsWith(".thirdweb.com");
}

/**
 * @internal
 */
export function getSignerAndProvider(
  network: NetworkInput,
  options?: SDKOptions,
): [Signer | undefined, providers.Provider] {
  let signer: Signer | undefined;
  let provider: providers.Provider | undefined;

  if (isSigner(network)) {
    // Here, we have an ethers.Signer
    signer = network;
    if (network.provider) {
      provider = network.provider;
    }
  } else if (isProvider(network)) {
    // Here, we have an ethers.providers.Provider
    provider = network;
  } else {
    // Here, we must have a ChainOrRpcUrl, which is a chain name, chain id, rpc url, or chain config
    // All of which, getChainProvider can handle for us
    provider = getChainProvider(network, options);
  }

  if (options?.readonlySettings) {
    // If readonly settings are specified, then overwrite the provider
    provider = getProviderFromRpcUrl(
      options.readonlySettings.rpcUrl,
      options,
      options.readonlySettings.chainId,
    );
  }

  // At this point, if we don't have a provider, don't default to a random chain
  // Instead, just throw an error
  if (!provider) {
    if (signer) {
      throw new Error(
        "No provider passed to the SDK! Please make sure that your signer is connected to a provider!",
      );
    }

    throw new Error(
      "No provider found! Make sure to specify which network to connect to, or pass a signer or provider to the SDK!",
    );
  }

  return [signer, provider];
}
