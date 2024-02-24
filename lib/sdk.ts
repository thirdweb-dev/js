import { getAbsoluteUrl } from "./vercel-utils";
import { ThirdwebSDK as EVMThirdwebSDK, SDKOptions } from "@thirdweb-dev/sdk";
import {
  IStorageDownloader,
  StorageDownloader,
  ThirdwebStorage,
  GatewayUrls,
  SingleDownloadOptions,
} from "@thirdweb-dev/storage";
import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  DASHBOARD_THIRDWEB_SECRET_KEY,
  isProd,
} from "constants/rpc";
import type { Signer } from "ethers";

// use env var to set IPFS gateway or fallback to ipfscdn.io
export const IPFS_GATEWAY_URL =
  (process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL as string) ||
  "https://{clientId}.ipfscdn.io/ipfs/{cid}/{path}";

export function replaceIpfsUrl(url: string) {
  try {
    return StorageSingleton.resolveScheme(url);
  } catch (err) {
    console.error("error resolving ipfs url", url, err);
    return url;
  }
}

const ProxyHostNames = new Set<string>();

const defaultDownloader = new StorageDownloader({
  clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
  secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
});

class SpecialDownloader implements IStorageDownloader {
  async download(
    url: string,
    gatewayUrls?: GatewayUrls,
    options?: SingleDownloadOptions,
  ): Promise<Response> {
    if (url.startsWith("ipfs://")) {
      return defaultDownloader.download(
        url,
        { "ipfs://": [IPFS_GATEWAY_URL] },
        options,
      );
    }

    // data urls we always want to just fetch directly
    if (url.startsWith("data")) {
      return fetch(url);
    }

    if (url.startsWith("http")) {
      const u = new URL(url);

      // if we already know the hostname is bad, don't even try
      if (ProxyHostNames.has(u.hostname)) {
        return fetch(`${getAbsoluteUrl()}/api/proxy?url=${u.toString()}`);
      }

      try {
        // try to just fetch it directly
        const res = await fetch(u);
        if (await res.clone().json()) {
          return res;
        }
        // if we hit this we know something failed and we'll try to proxy it
        ProxyHostNames.add(u.hostname);

        throw new Error("not ok");
      } catch (e) {
        // this is a bit scary but hey, it works
        return fetch(`${getAbsoluteUrl()}/api/proxy?url=${u.toString()}`);
      }
    }

    throw new Error("not a valid url");
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
  downloader: new SpecialDownloader(),
});

// EVM SDK
const EVM_SDK_MAP = new Map<string, EVMThirdwebSDK>();

export function getEVMThirdwebSDK(
  chainId: number,
  rpcUrl: string,
  sdkOptions?: SDKOptions,
  signer?: Signer,
): EVMThirdwebSDK {
  try {
    new URL(rpcUrl);
  } catch (e) {
    console.error("Invalid rpcUrl", e, rpcUrl);
    // overwrite the rpcUrl with a valid one!
    if (isProd) {
      rpcUrl = `https://${chainId}.rpc.thirdweb.com/${DASHBOARD_THIRDWEB_CLIENT_ID}`;
    } else {
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
  const sdkKey =
    chainId + rpcUrl + (sdkOptions ? JSON.stringify(sdkOptions) : "");

  let sdk: EVMThirdwebSDK | null = null;

  if (EVM_SDK_MAP.has(sdkKey)) {
    sdk = EVM_SDK_MAP.get(sdkKey) as EVMThirdwebSDK;
  } else {
    sdk = new EVMThirdwebSDK(
      rpcUrl,
      {
        ...sdkOptions,
        readonlySettings,
        clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
        secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
      },
      StorageSingleton,
    );

    EVM_SDK_MAP.set(sdkKey, sdk);
  }

  if (signer) {
    sdk.updateSignerOrProvider(signer);
  }

  return sdk;
}
