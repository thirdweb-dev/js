import type {
  GetV1NftsByContractAddressByTokenIdData,
  GetV1NftsByContractAddressData,
  GetV1NftsByContractAddressResponse,
  GetV1NftsData,
  GetV1NftsResponse,
} from "@thirdweb-dev/insight";
import type { Chain } from "../chains/types.js";
import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { getContract } from "../contract/contract.js";
import { getAddress } from "../utils/address.js";
import type { NFT } from "../utils/nft/parseNft.js";

type OwnedNFT = GetV1NftsResponse["data"][number];
type ContractNFT = GetV1NftsByContractAddressResponse["data"][number];

/**
 * Get NFTs owned by an address
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const nfts = await Insight.getOwnedNFTs({
 *   client,
 *   chains: [sepolia],
 *   ownerAddress: "0x1234567890123456789012345678901234567890",
 * });
 * ```
 * @insight
 */
export async function getOwnedNFTs(args: {
  client: ThirdwebClient;
  chains: Chain[];
  ownerAddress: string;
  includeMetadata?: boolean;
  queryOptions?: Omit<GetV1NftsData["query"], "owner_address" | "chain">;
}): Promise<(NFT & { quantityOwned: bigint })[]> {
  const [
    { getV1Nfts },
    { getThirdwebDomains },
    { getClientFetch },
    { assertInsightEnabled },
    { stringify },
  ] = await Promise.all([
    import("@thirdweb-dev/insight"),
    import("../utils/domains.js"),
    import("../utils/fetch.js"),
    import("./common.js"),
    import("viem"),
  ]);

  // TODO (insight): add support for contract address filters
  const { client, chains, ownerAddress, queryOptions } = args;

  await assertInsightEnabled(chains);

  const defaultQueryOptions: GetV1NftsData["query"] = {
    chain: chains.map((chain) => chain.id),
    // metadata: includeMetadata ? "true" : "false", TODO (insight): add support for this
    limit: 50,
    owner_address: ownerAddress,
  };

  const result = await getV1Nfts({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
    query: {
      ...defaultQueryOptions,
      ...queryOptions,
    },
  });

  if (result.error) {
    throw new Error(
      `${result.response.status} ${result.response.statusText} - ${result.error ? stringify(result.error) : "Unknown error"}`,
    );
  }

  const transformedNfts = await transformNFTModel(
    result.data?.data ?? [],
    client,
    ownerAddress,
  );
  return transformedNfts.map((nft) => ({
    ...nft,
    quantityOwned: nft.quantityOwned ?? 1n,
  }));
}

/**
 * Get all NFTs from a contract
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const nfts = await Insight.getContractNFTs({
 *   client,
 *   chains: [sepolia],
 *   contractAddress: "0x1234567890123456789012345678901234567890",
 * });
 * ```
 * @insight
 */
export async function getContractNFTs(args: {
  client: ThirdwebClient;
  chains: Chain[];
  contractAddress: string;
  includeMetadata?: boolean;
  includeOwners?: boolean;
  queryOptions?: Omit<GetV1NftsByContractAddressData["query"], "chain">;
}): Promise<NFT[]> {
  const [
    { getV1NftsByContractAddress },
    { getThirdwebDomains },
    { getClientFetch },
    { assertInsightEnabled },
    { stringify },
  ] = await Promise.all([
    import("@thirdweb-dev/insight"),
    import("../utils/domains.js"),
    import("../utils/fetch.js"),
    import("./common.js"),
    import("../utils/json.js"),
  ]);

  const {
    client,
    chains,
    contractAddress,
    includeOwners = true,
    queryOptions,
  } = args;

  const defaultQueryOptions: GetV1NftsByContractAddressData["query"] = {
    chain: chains.map((chain) => chain.id),
    include_owners:
      includeOwners === true ? ("true" as const) : ("false" as const),
    // metadata: includeMetadata ? "true" : "false", TODO (insight): add support for this
    limit: 50,
  };

  await assertInsightEnabled(chains);

  const result = await getV1NftsByContractAddress({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
    path: {
      contract_address: contractAddress,
    },
    query: {
      ...defaultQueryOptions,
      ...queryOptions,
    },
  });

  if (result.error) {
    throw new Error(
      `${result.response.status} ${result.response.statusText} - ${result.error ? stringify(result.error) : "Unknown error"}`,
    );
  }

  return transformNFTModel(result.data?.data ?? [], client);
}

/**
 * Get NFT metadata by contract address and token id
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const nft = await Insight.getNFT({
 *   client,
 *   chain: sepolia,
 *   contractAddress: "0x1234567890123456789012345678901234567890",
 *   tokenId: 1n,
 * });
 * ```
 * @insight
 */
export async function getNFT(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractAddress: string;
  tokenId: bigint | number | string;
  includeOwners?: boolean;
  queryOptions?: GetV1NftsByContractAddressByTokenIdData["query"];
}): Promise<NFT | undefined> {
  const [
    { getV1NftsByContractAddressByTokenId },
    { getThirdwebDomains },
    { getClientFetch },
    { assertInsightEnabled },
    { stringify },
  ] = await Promise.all([
    import("@thirdweb-dev/insight"),
    import("../utils/domains.js"),
    import("../utils/fetch.js"),
    import("./common.js"),
    import("../utils/json.js"),
  ]);

  const {
    client,
    chain,
    contractAddress,
    tokenId,
    includeOwners = true,
    queryOptions,
  } = args;

  await assertInsightEnabled([chain]);

  const defaultQueryOptions: GetV1NftsByContractAddressByTokenIdData["query"] =
    {
      chain_id: [chain.id],
      include_owners:
        includeOwners === true ? ("true" as const) : ("false" as const),
    };

  const result = await getV1NftsByContractAddressByTokenId({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
    path: {
      contract_address: contractAddress,
      token_id: tokenId.toString(),
    },
    query: {
      ...defaultQueryOptions,
      ...queryOptions,
    },
  });

  if (result.error) {
    throw new Error(
      `${result.response.status} ${result.response.statusText} - ${result.error ? stringify(result.error) : "Unknown error"}`,
    );
  }

  const transformedNfts = await transformNFTModel(
    result.data?.data ?? [],
    client,
  );
  return transformedNfts?.[0];
}

async function transformNFTModel(
  nfts: (ContractNFT | OwnedNFT)[],
  client: ThirdwebClient,
  ownerAddress?: string,
): Promise<(NFT & { quantityOwned?: bigint })[]> {
  const [{ parseNFT }, { totalSupply }] = await Promise.all([
    import("../utils/nft/parseNft.js"),
    import("../extensions/erc1155/__generated__/IERC1155/read/totalSupply.js"),
  ]);

  return await Promise.all(
    nfts.map(async (nft) => {
      let parsedNft: NFT;
      const {
        contract,

        // biome-ignore lint/correctness/noUnusedVariables: explicitly unused to not include it in the resulting metadata
        extra_metadata,
        // biome-ignore lint/correctness/noUnusedVariables: explicitly unused to not include it in the resulting metadata
        collection,
        metadata_url,
        // biome-ignore lint/correctness/noUnusedVariables: explicitly unused to not include it in the resulting metadata
        chain_id,
        token_id,
        // biome-ignore lint/correctness/noUnusedVariables: explicitly unused to not include it in the resulting metadata
        status,
        balance,
        // biome-ignore lint/correctness/noUnusedVariables: explicitly unused to not include it in the resulting metadata
        token_type,
        ...rest
      } = nft;

      let metadataToUse = rest;
      let owners: string[] | undefined = ownerAddress
        ? [getAddress(ownerAddress)]
        : undefined;

      if ("owner_addresses" in rest) {
        const { owner_addresses, ...restWithoutOwnerAddresses } = rest;
        metadataToUse = restWithoutOwnerAddresses;
        owners = owners ?? owner_addresses?.map((o) => getAddress(o));
      }

      const metadata = replaceIPFSGatewayRecursively({
        attributes: nft.extra_metadata?.attributes ?? undefined,
        image: nft.image_url,
        uri: nft.metadata_url ?? "",
        ...metadataToUse,
      });

      if (contract?.type === "erc1155") {
        // TODO (insight): this needs to be added in the API
        const supply = await totalSupply({
          contract: getContract({
            address: contract.address,
            chain: getCachedChain(contract.chain_id),
            client: client,
          }),
          id: BigInt(token_id),
        }).catch(() => 0n);

        parsedNft = parseNFT(metadata, {
          chainId: contract?.chain_id ?? 0,
          owner: owners?.[0],
          supply: supply,
          tokenAddress: contract?.address ?? "",
          tokenId: BigInt(token_id),
          tokenUri: replaceIPFSGateway(metadata_url) ?? "",
          type: "ERC1155",
        });
      } else {
        parsedNft = parseNFT(metadata, {
          chainId: contract?.chain_id ?? 0,
          owner: owners?.[0],
          tokenAddress: contract?.address ?? "",
          tokenId: BigInt(token_id),
          tokenUri: replaceIPFSGateway(metadata_url) ?? "",
          type: "ERC721",
        });
      }

      return {
        ...parsedNft,
        ...(contract?.type === "erc1155"
          ? { quantityOwned: balance ? BigInt(balance) : undefined }
          : {}),
      };
    }),
  );
}

// biome-ignore lint/suspicious/noExplicitAny: this should be fixed in the API
function replaceIPFSGatewayRecursively(obj: any) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = replaceIPFSGateway(obj[key]);
    } else {
      replaceIPFSGatewayRecursively(obj[key]);
    }
  }
  return obj;
}

function replaceIPFSGateway(url?: string) {
  if (!url || typeof url !== "string") {
    return url;
  }
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.host.endsWith(".ipfscdn.io")) {
      const paths = parsedUrl.pathname.split("/");
      const index = paths.findIndex((path) => path === "ipfs");
      if (index === -1) {
        return url;
      }
      const ipfsHash = paths.slice(index + 1).join("/");
      if (ipfsHash) {
        return `ipfs://${ipfsHash}`;
      }
      return url;
    }
  } catch {
    // If the URL is invalid, return it as is
    return url;
  }
  return url;
}
