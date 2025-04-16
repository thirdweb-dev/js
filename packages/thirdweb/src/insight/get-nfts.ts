import type {
  GetV1NftsByContractAddressByTokenIdData,
  GetV1NftsByContractAddressData,
  GetV1NftsByContractAddressResponse,
  GetV1NftsData,
  GetV1NftsResponse,
} from "@thirdweb-dev/insight";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
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
    // metadata: includeMetadata ? "true" : "false", TODO (insight): add support for this
    limit: 50,
    include_owners:
      includeOwners === true ? ("true" as const) : ("false" as const),
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

  return transformNFTModel(result.data?.data ?? []);
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
      chain: chain.id,
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

  const transformedNfts = await transformNFTModel(result.data?.data ?? []);
  return transformedNfts?.[0];
}

async function transformNFTModel(
  nfts: (ContractNFT | OwnedNFT)[],
  ownerAddress?: string,
): Promise<(NFT & { quantityOwned?: bigint })[]> {
  const { parseNFT } = await import("../utils/nft/parseNft.js");

  return nfts.map((nft) => {
    let parsedNft: NFT;
    const {
      contract,
      extra_metadata,
      collection,
      metadata_url,
      chain_id,
      token_id,
      status,
      balance,
      token_type,
      ...rest
    } = nft;
    const metadata = {
      uri: nft.metadata_url ?? "",
      image: nft.image_url,
      attributes: nft.extra_metadata?.attributes ?? undefined,
      ...rest,
    };

    const owner_addresses = ownerAddress
      ? [ownerAddress]
      : "owner_addresses" in nft
        ? nft.owner_addresses
        : undefined;

    if (contract?.type === "erc1155") {
      parsedNft = parseNFT(metadata, {
        tokenId: BigInt(token_id),
        tokenUri: metadata_url ?? "",
        type: "ERC1155",
        owner: owner_addresses?.[0],
        tokenAddress: contract?.address ?? "",
        chainId: contract?.chain_id ?? 0,
        supply: balance ? BigInt(balance) : 0n, // TODO (insight): this is wrong, needs to be added in the API
      });
    } else {
      parsedNft = parseNFT(metadata, {
        tokenId: BigInt(token_id),
        type: "ERC721",
        owner: owner_addresses?.[0],
        tokenUri: metadata_url ?? "",
        tokenAddress: contract?.address ?? "",
        chainId: contract?.chain_id ?? 0,
      });
    }

    return parsedNft;
  });
}
