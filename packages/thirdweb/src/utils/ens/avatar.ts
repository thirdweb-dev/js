import { getCachedChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { isAddress } from "../address.js";
import { getClientFetch } from "../fetch.js";
import { resolveScheme } from "../ipfs.js";

type AvatarOptions = {
  client: ThirdwebClient;
  uri: string;
};

/**
 * @internal
 */
export async function parseAvatarRecord(
  options: AvatarOptions,
): Promise<string | null> {
  let uri: string | null = options.uri;
  if (/eip155:/i.test(options.uri)) {
    // do nft uri parsing
    uri = await parseNftUri(options);
  }
  if (!uri) {
    return null;
  }
  const resolvedScheme = resolveScheme({
    client: options.client,
    uri,
  });

  // check if it's an image
  if (await isImageUri({ client: options.client, uri: resolvedScheme })) {
    return resolvedScheme;
  }
  return null;
}

/**
 * @internal
 */
async function parseNftUri(options: AvatarOptions): Promise<string | null> {
  let uri = options.uri;
  // parse valid nft spec (CAIP-22/CAIP-29)
  // @see: https://github.com/ChainAgnostic/CAIPs/tree/master/CAIPs
  if (uri.startsWith("did:nft:")) {
    // convert DID to CAIP
    uri = uri.replace("did:nft:", "").replace(/_/g, "/");
  }

  const [reference = "", asset_namespace = "", tokenID = ""] = uri.split("/");
  const [eip_namespace, chainID] = reference.split(":");
  const [erc_namespace, contractAddress] = asset_namespace.split(":");

  if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155") {
    throw new Error(
      `Invalid EIP namespace, expected EIP155, got: "${eip_namespace}"`,
    );
  }
  if (!chainID) {
    throw new Error("Chain ID not found");
  }
  if (!contractAddress || !isAddress(contractAddress)) {
    throw new Error("Contract address not found");
  }
  if (!tokenID) {
    throw new Error("Token ID not found");
  }
  const chain = getCachedChain(Number(chainID));
  const contract = getContract({
    client: options.client,
    chain,
    address: contractAddress,
  });
  switch (erc_namespace) {
    case "erc721": {
      const { getNFT } = await import("../../extensions/erc721/read/getNFT.js");
      const nft = await getNFT({
        contract,
        tokenId: BigInt(tokenID),
      });
      return nft.metadata.image ?? null;
    }
    case "erc1155": {
      const { getNFT } = await import(
        "../../extensions/erc1155/read/getNFT.js"
      );
      const nft = await getNFT({
        contract,
        tokenId: BigInt(tokenID),
      });
      return nft.metadata.image ?? null;
    }

    default: {
      throw new Error(
        `Invalid ERC namespace, expected ERC721 or ERC1155, got: "${erc_namespace}"`,
      );
    }
  }
}

async function isImageUri(options: AvatarOptions): Promise<boolean> {
  try {
    const res = await getClientFetch(options.client)(options.uri, {
      method: "HEAD",
    });
    // retrieve content type header to check if content is image
    if (res.status === 200) {
      const contentType = res.headers.get("content-type");
      return !!contentType?.startsWith("image/");
    }
    return false;
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  } catch (error: any) {
    // if error is not cors related then fail
    if (typeof error === "object" && typeof error.response !== "undefined") {
      return false;
    }
    // fail in NodeJS, since the error is not cors but any other network issue
    if (Object.hasOwn(globalThis, "Image")) {
      return false;
    }
    // in case of cors, use image api to validate if given url is an actual image
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = options.uri;
    });
  }
}
