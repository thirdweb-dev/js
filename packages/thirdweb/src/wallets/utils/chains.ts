import type { ApiChain } from "../../chain/types.js";

// TODO - move this to chains subfolder

/**
 * Remove client id from RPC url for given chain
 * @internal
 */
export function getValidPublicRPCUrl(chain: ApiChain) {
  return getValidChainRPCs(chain).map((rpc) => {
    try {
      const url = new URL(rpc);
      // remove client id from url
      if (url.hostname.endsWith(".thirdweb.com")) {
        url.pathname = "";
        url.search = "";
      }
      return url.toString();
    } catch (e) {
      return rpc;
    }
  });
}

// TODO - move this to chains/
/**
 * Get valid RPCs for given chain
 * @internal
 */
export function getValidChainRPCs(
  chain: Pick<ApiChain, "rpc" | "chainId">,
  clientId?: string,
  mode: "http" | "ws" = "http",
): string[] {
  const processedRPCs: string[] = [];

  chain.rpc.forEach((rpc) => {
    // exclude RPC if mode mismatch
    if (mode === "http" && !rpc.startsWith("http")) {
      return;
    }

    if (mode === "ws" && !rpc.startsWith("ws")) {
      return;
    }

    // Replace API_KEY placeholder with value
    if (rpc.includes("${THIRDWEB_API_KEY}")) {
      if (clientId) {
        processedRPCs.push(
          rpc.replace("${THIRDWEB_API_KEY}", clientId) +
            (typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                `/?bundleId=${globalThis.APP_BUNDLE_ID}`
              : ""),
        );
      } else {
        // if no client id, let it through with empty string
        // if secretKey is present, it will be used in header
        // if none are passed, will have reduced access
        processedRPCs.push(rpc.replace("${THIRDWEB_API_KEY}", ""));
      }
    }

    // exclude RPCs with unknown placeholder
    else if (rpc.includes("${")) {
      return;
    }

    // add as is
    else {
      processedRPCs.push(rpc);
    }
  });

  if (processedRPCs.length === 0) {
    throw new Error(
      `No RPC available for chainId "${chain.chainId}" with mode ${mode}`,
    );
  }

  return processedRPCs;
}
