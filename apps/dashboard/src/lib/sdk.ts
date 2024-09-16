import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  DASHBOARD_THIRDWEB_SECRET_KEY,
  IPFS_GATEWAY_URL,
  isProd,
} from "@/constants/env";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { Signer } from "ethers";
import { polygon } from "thirdweb/chains";
import { resolveScheme } from "thirdweb/storage";
import { thirdwebClient } from "../@/constants/client";

export function replaceIpfsUrl(uri: string) {
  try {
    return resolveScheme({
      uri,
      client: thirdwebClient,
    });
  } catch (err) {
    console.error("error resolving ipfs url", uri, err);
    return uri;
  }
}

export const DASHBOARD_STORAGE_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_UPLOAD_SERVER ||
  "https://storage.thirdweb.com";

export const StorageSingleton = new ThirdwebStorage({
  gatewayUrls: [IPFS_GATEWAY_URL],
  clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
  secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
  uploadServerUrl: DASHBOARD_STORAGE_URL,
}) as ThirdwebStorage;

// EVM SDK
const EVM_SDK_MAP = new Map<string, ThirdwebSDK>();

export function getThirdwebSDK(chainId: number, rpcUrl: string): ThirdwebSDK {
  try {
    new URL(rpcUrl);
  } catch (e) {
    console.error("Invalid rpcUrl", e, rpcUrl);
    // overwrite the rpcUrl with a valid one!
    if (isProd) {
      // biome-ignore lint/style/noParameterAssign: FIXME
      rpcUrl = `https://${chainId}.rpc.thirdweb.com/${DASHBOARD_THIRDWEB_CLIENT_ID}`;
    } else {
      // biome-ignore lint/style/noParameterAssign: FIXME
      rpcUrl = `https://${chainId}.rpc.thirdweb-dev.com/${DASHBOARD_THIRDWEB_CLIENT_ID}`;
    }
  }

  const readonlySettings =
    chainId && rpcUrl
      ? {
          chainId,
          rpcUrl,
        }
      : undefined;

  // PERF ISSUE - if the sdkOptions is a huge object, stringify will be slow
  const sdkKey = chainId + rpcUrl;

  let sdk: ThirdwebSDK | null = null;

  if (EVM_SDK_MAP.has(sdkKey)) {
    sdk = EVM_SDK_MAP.get(sdkKey) as ThirdwebSDK;
  } else {
    sdk = new ThirdwebSDK(
      rpcUrl,
      {
        readonlySettings,
        clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
        secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
      },
      StorageSingleton,
    );

    EVM_SDK_MAP.set(sdkKey, sdk);
  }

  return sdk;
}

export function getPolygonGaslessSDK(signer: Signer) {
  let polygonRpcUrl = isProd
    ? "https://137.rpc.thirdweb.com"
    : "https://137.rpc.thirdweb-dev.com";
  if (DASHBOARD_THIRDWEB_CLIENT_ID) {
    polygonRpcUrl += `/${DASHBOARD_THIRDWEB_CLIENT_ID}`;
  }
  return ThirdwebSDK.fromSigner(signer, polygonRpcUrl, {
    readonlySettings: {
      chainId: polygon.id,
      rpcUrl: polygonRpcUrl,
    },
    clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
    secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
    gasless: {
      engine: {
        relayerUrl:
          "https://checkout.engine.thirdweb.com/relayer/0c2bdd3a-307f-4243-b6e5-5ba495222d2b",
        relayerForwarderAddress: "0x409d530a6961297ece29121dbee2c917c3398659",
      },
      experimentalChainlessSupport: true,
    },
  });
}
