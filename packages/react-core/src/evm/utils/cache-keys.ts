import { RequiredParam } from "../../core/query-utils/required-param";
import { ContractAddress, WalletAddress } from "../types";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type {
  ClaimConditionFetchOptions,
  MarketplaceFilter,
  QueryAllParams,
  SUPPORTED_CHAIN_ID,
} from "@thirdweb-dev/sdk";
import { BigNumberish, CallOverrides, constants } from "ethers";

const TW_CACHE_KEY_PREFIX = "tw-cache";

/**
 * @internal
 */
function enforceCachePrefix(input: QueryKey): QueryKey {
  return [
    TW_CACHE_KEY_PREFIX,
    ...input.filter((i) => typeof i !== "string" || i !== TW_CACHE_KEY_PREFIX),
  ];
}

/**
 * @internal
 */
export function createContractCacheKey(
  contractAddress: string | null = constants.AddressZero,
  input: QueryKey = [],
): QueryKey {
  return enforceCachePrefix(["contract", contractAddress, ...input]);
}

/**
 @internal
 */
export function createCacheKeyWithNetwork(
  input: QueryKey,
  chainId: RequiredParam<SUPPORTED_CHAIN_ID>,
): QueryKey {
  return enforceCachePrefix(cacheKeys.network.active(chainId).concat(input));
}

/**
 * @internal
 */
export function invalidateContractAndBalances(
  queryClient: QueryClient,
  contractAddress: RequiredParam<ContractAddress>,
  chainId: RequiredParam<SUPPORTED_CHAIN_ID>,
): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries(
      enforceCachePrefix(
        createCacheKeyWithNetwork(
          createContractCacheKey(contractAddress),
          chainId,
        ),
      ),
    ),
    queryClient.invalidateQueries(
      enforceCachePrefix(createCacheKeyWithNetwork(["balance"], chainId)),
    ),
  ]);
}

/**
 @internal
 */
export const cacheKeys = {
  auth: {
    user: () => enforceCachePrefix(["user"]),
  },
  network: {
    active: (chainId: RequiredParam<SUPPORTED_CHAIN_ID>) =>
      enforceCachePrefix(["chainId", chainId]),
  },
  wallet: {
    balance: (
      chainId: number,
      walletAddress: RequiredParam<WalletAddress>,
      tokenAddress?: ContractAddress,
    ) =>
      enforceCachePrefix(
        createCacheKeyWithNetwork(
          enforceCachePrefix(["balance", { walletAddress, tokenAddress }]),
          chainId,
        ),
      ),
  },
  contract: {
    read: (
      contractAddress: RequiredParam<ContractAddress>,
      fnIdentity: string,
    ) => createContractCacheKey(contractAddress, ["read", fnIdentity]),
    type: (contractAddress: RequiredParam<ContractAddress>) =>
      createContractCacheKey(contractAddress, ["contract-type"]),
    compilerMetadata: (contractAddress: RequiredParam<ContractAddress>) =>
      createContractCacheKey(contractAddress, ["publish-metadata"]),
    typeAndCompilerMetadata: (
      contractAddress: RequiredParam<ContractAddress>,
    ) =>
      createContractCacheKey(contractAddress, ["contract-type-and-metadata"]),
    metadata: (contractAddress: RequiredParam<ContractAddress>) =>
      createContractCacheKey(contractAddress, ["metadata"]),
    extractFunctions: (contractAddress: RequiredParam<ContractAddress>) =>
      createContractCacheKey(contractAddress, ["extractFunctions"]),
    call: (
      contractAddress: RequiredParam<ContractAddress>,
      functionName: RequiredParam<string>,
      args?: unknown[],
      overrides?: CallOverrides,
    ) =>
      createContractCacheKey(contractAddress, [
        "call",
        functionName,
        args,
        overrides,
      ]),

    smartWalletFactory: {
      getAll: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["smartWalletFactory"]),
      isSmartWalletDeployed: (contractAdress: RequiredParam<ContractAddress>, admin: RequiredParam<string>) =>
        createContractCacheKey(contractAdress, ["isSmartWalletDeployed", admin]),
      getAllForAddress: (contractAdress: RequiredParam<ContractAddress>, address: RequiredParam<string>) =>
        createContractCacheKey(contractAdress, ["getAllForAddress", address]),
    },

    smartWallet: {
      signers: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["smartWallet", "signers"]),
    },

    app: {
      get: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["appURI"]),
    },

    events: {
      getEvents: (
        contractAddress: RequiredParam<ContractAddress>,
        eventName: string,
      ) =>
        createContractCacheKey(contractAddress, [
          "events",
          "getEvents",
          { eventName },
        ]),
      getAllEvents: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["events", "getAllEvents"]),
    },

    // specific contract types
    nft: {
      get: (
        contractAddress: RequiredParam<ContractAddress>,
        tokenId: RequiredParam<BigNumberish>,
      ) => createContractCacheKey(contractAddress, ["get", { tokenId }]),
      balanceOf: (
        contractAddress: RequiredParam<ContractAddress>,
        owner: RequiredParam<WalletAddress>,
        tokenId: RequiredParam<BigNumberish>,
      ) =>
        createContractCacheKey(contractAddress, [
          "balanceOf",
          { owner, tokenId },
        ]),
      query: {
        all: (
          contractAddress: RequiredParam<ContractAddress>,
          params?: QueryAllParams,
        ) =>
          createContractCacheKey(
            contractAddress,
            params ? ["query", "all", params] : ["query", "all"],
          ),
        totalCirculatingSupply: (
          contractAddress: RequiredParam<ContractAddress>,
        ) =>
          createContractCacheKey(contractAddress, [
            "query",
            "totalCirculatingSupply",
          ]),
        totalCount: (contractAddress: RequiredParam<ContractAddress>) =>
          createContractCacheKey(contractAddress, ["query", "totalCount"]),
        owned: {
          all: (
            contractAddress: RequiredParam<ContractAddress>,
            owner: RequiredParam<WalletAddress>,
          ) =>
            createContractCacheKey(contractAddress, [
              "query",
              "owned",
              "all",
              owner,
            ]),
        },
      },
      sharedMetadata: {
        get: (
          contractAddress: RequiredParam<ContractAddress>,
        ) =>
          createContractCacheKey(
            contractAddress
          ),
      },
      drop: {
        getAllUnclaimed: (
          contractAddress: RequiredParam<ContractAddress>,
          params?: QueryAllParams,
        ) =>
          createContractCacheKey(
            contractAddress,
            params ? ["getAllUnclaimed", params] : ["getAllUnclaimed"],
          ),
        getAllClaimed: (
          contractAddress: RequiredParam<ContractAddress>,
          params?: QueryAllParams,
        ) =>
          createContractCacheKey(
            contractAddress,
            params ? ["getAllClaimed", params] : ["getAllClaimed"],
          ),
        totalUnclaimedSupply: (
          contractAddress: RequiredParam<ContractAddress>,
        ) => createContractCacheKey(contractAddress, ["totalUnclaimedSupply"]),
        totalClaimedSupply: (contractAddress: RequiredParam<ContractAddress>) =>
          createContractCacheKey(contractAddress, ["totalClaimedSupply"]),
        revealer: {
          getBatchesToReveal: (
            contractAddress: RequiredParam<ContractAddress>,
            params?: QueryAllParams,
          ) =>
            createContractCacheKey(
              contractAddress,
              params ? ["getBatchesToReveal", params] : ["getBatchesToReveal"],
            ),
        },
      },
    },

    token: {
      totalSupply: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["totalSupply"]),
      decimals: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["decimals"]),
      balanceOf: (
        contractAddress: RequiredParam<ContractAddress>,
        walletAddress: RequiredParam<ContractAddress>,
      ) =>
        createContractCacheKey(contractAddress, [
          "balanceOf",
          { walletAddress },
        ]),
    },
    marketplace: {
      getListing: (
        contractAddress: RequiredParam<ContractAddress>,
        listingId: RequiredParam<BigNumberish>,
      ) =>
        createContractCacheKey(contractAddress, ["getListing", { listingId }]),
      getAllListings: (
        contractAddress: RequiredParam<ContractAddress>,
        params?: MarketplaceFilter,
      ) =>
        createContractCacheKey(
          contractAddress,
          params ? ["getAllListings", params] : ["getAllListings"],
        ),
      getTotalCount: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["getTotalCount"]),
      getActiveListings: (
        contractAddress: RequiredParam<ContractAddress>,
        params?: MarketplaceFilter,
      ) =>
        createContractCacheKey(
          contractAddress,
          params ? ["getActiveListings", params] : ["getActiveListings"],
        ),
      getBidBufferBps: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["getBidBufferBps"]),

      auction: {
        getWinningBid: (
          contractAddress: RequiredParam<ContractAddress>,
          listingId: RequiredParam<BigNumberish>,
        ) =>
          createContractCacheKey(contractAddress, [
            "auction",
            "getWinningBid",
            { listingId },
          ]),
        getWinner: (
          contractAddress: RequiredParam<ContractAddress>,
          listingId: RequiredParam<BigNumberish>,
        ) =>
          createContractCacheKey(contractAddress, [
            "auction",
            "getWinner",
            { listingId },
          ]),
      },

      directListings: {
        getAll: (
          contractAddress: RequiredParam<ContractAddress>,
          params?: MarketplaceFilter,
        ) =>
          createContractCacheKey(
            contractAddress,
            params
              ? ["getAllDirectListings", params]
              : ["getAllDirectListings"],
          ),
        getAllValid: (
          contractAddress: RequiredParam<ContractAddress>,
          params?: MarketplaceFilter,
        ) =>
          createContractCacheKey(
            contractAddress,
            params
              ? ["getAllValidDirectListings", params]
              : ["getAllValidDirectListings"],
          ),
        getListing: (
          contractAddress: RequiredParam<ContractAddress>,
          listingId: RequiredParam<BigNumberish>,
        ) =>
          createContractCacheKey(contractAddress, [
            "getListing",
            { listingId },
          ]),
        getTotalCount: (contractAddress: RequiredParam<ContractAddress>) =>
          createContractCacheKey(contractAddress, [
            "getTotalDirectListingsCount",
          ]),
      },

      englishAuctions: {
        getAll: (
          contractAddress: RequiredParam<ContractAddress>,
          params?: MarketplaceFilter,
        ) =>
          createContractCacheKey(
            contractAddress,
            params
              ? ["getAllEnglishAuctions", params]
              : ["getAllEnglishAuctions"],
          ),
        getAllValid: (
          contractAddress: RequiredParam<ContractAddress>,
          params?: MarketplaceFilter,
        ) =>
          createContractCacheKey(
            contractAddress,
            params
              ? ["getAllEValidEnglishAuctions", params]
              : ["getAllEValidEnglishAuctions"],
          ),
        getAuction: (
          contractAddress: RequiredParam<ContractAddress>,
          auctionId: RequiredParam<BigNumberish>,
        ) =>
          createContractCacheKey(contractAddress, [
            "getAuction",
            { auctionId },
          ]),
        getWinningBid: (
          contractAddress: RequiredParam<ContractAddress>,
          auctionId: RequiredParam<BigNumberish>,
        ) =>
          createContractCacheKey(contractAddress, [
            "getWinningBid",
            { auctionId },
          ]),
        getTotalCount: (contractAddress: RequiredParam<ContractAddress>) =>
          createContractCacheKey(contractAddress, [
            "getTotalEnglishAuctionsCount",
          ]),
      },
    },
  },
  // extensions
  extensions: {
    claimConditions: {
      getActive: (
        contractAddress: RequiredParam<ContractAddress>,
        tokenId?: BigNumberish,
        options?: ClaimConditionFetchOptions,
      ) =>
        createContractCacheKey(
          contractAddress,
          tokenId
            ? ["claimConditions", "getActive", { tokenId }, options]
            : ["claimConditions", "getActive", options],
        ),
      getAll: (
        contractAddress: RequiredParam<ContractAddress>,
        tokenId?: BigNumberish,
        options?: ClaimConditionFetchOptions,
      ) =>
        createContractCacheKey(
          contractAddress,
          tokenId
            ? ["claimConditions", "getAll", { tokenId }, options]
            : ["claimConditions", "getAll", options],
        ),
      getClaimerProofs: (
        contractAddress: RequiredParam<ContractAddress>,
        tokenId?: BigNumberish,
      ) =>
        createContractCacheKey(
          contractAddress,
          tokenId
            ? ["claimConditions", "getClaimerProofs", { tokenId }]
            : ["claimConditions", "getClaimerProofs"],
        ),
      getClaimIneligibilityReasons: (
        contractAddress: RequiredParam<ContractAddress>,
        params: { walletAddress?: WalletAddress; quantity: string | number },
        tokenId?: BigNumberish,
      ) =>
        createContractCacheKey(
          contractAddress,
          tokenId
            ? [
                "claimConditions",
                "getIneligibilityReasons",
                { tokenId },
                params,
              ]
            : ["claimConditions", "getIneligibilityReasons", params],
        ),
      // combinations of queries cache keys
      useActiveClaimConditionForWallet: (
        contractAddress: RequiredParam<ContractAddress>,
        walletAddress: WalletAddress,
        tokenId?: BigNumberish,
      ) =>
        createContractCacheKey(
          contractAddress,
          tokenId
            ? [
                "claimConditions",
                "useActiveClaimConditionForWallet",
                { tokenId, walletAddress },
                ,
              ]
            : ["claimConditions", "getIneligibilityReasons", { walletAddress }],
        ),
    },

    // primary sale contracts
    sales: {
      getRecipient: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["sales"]),
    },
    // royalties
    royalties: {
      getDefaultRoyaltyInfo: (
        contractAddress: RequiredParam<ContractAddress>,
      ) => createContractCacheKey(contractAddress, ["royalties"]),
    },
    // platform fees
    platformFees: {
      get: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["platformFees"]),
    },
    // contract metadata
    metadata: {
      get: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["metadata"]),
    },
    roles: {
      getAll: (contractAddress: RequiredParam<ContractAddress>) =>
        createContractCacheKey(contractAddress, ["roles"]),
      get: (contractAddress: RequiredParam<ContractAddress>, role: string) =>
        createContractCacheKey(contractAddress, ["roles", { role }]),
    },
  },
} as const;
