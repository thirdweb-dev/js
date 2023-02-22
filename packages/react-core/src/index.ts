// main entry point = evm

// constants
export { __DEV__ } from "./core/constants/runtime";

// wallet hooks
export {
  useActiveChainId,
  useActiveWallet,
  useConnect,
  useConnectingToWallet,
  useCreateWalletInstance,
  useDisconnect,
  useSwitchChain,
  useWallets,
} from "./core/hooks/wallet-hooks";
export {
  useDeviceWalletStorage,
  useThirdwebWallet,
} from "./core/providers/thirdweb-wallet-provider";

// ThirdwebProvider
export { ThirdwebProvider } from "./core/providers/thirdweb-provider";
export type { ThirdwebProviderProps } from "./core/providers/thirdweb-provider";

// Utilities and Others
export { shouldNeverPersistQuery } from "./core/query-utils/query-key";
export type { RequiredParam } from "./core/query-utils/required-param";
export type { SupportedWallet } from "./core/types/wallet";

// auth
export {
  ThirdwebAuthProvider,
  useThirdwebAuthContext,
} from "./evm/contexts/thirdweb-auth";
export type { ThirdwebAuthConfig } from "./evm/contexts/thirdweb-auth";

// config
export {
  ThirdwebConfigProvider,
  useThirdwebConfigContext,
} from "./evm/contexts/thirdweb-config";

// connected wallet provider
export {
  ThirdwebConnectedWalletProvider,
  useThirdwebConnectedWalletContext,
} from "./evm/contexts/thirdweb-wallet";

// claim conditions
export type {
  ClaimIneligibilityParams,
  SetClaimConditionsParams,
} from "./evm/hooks/async/claim-conditions";
export {
  useActiveClaimCondition,
  useClaimerProofs,
  useClaimConditions,
  useClaimIneligibilityReasons,
  useActiveClaimConditionForWallet,
  useSetClaimConditions,
  useResetClaimConditions,
} from "./evm/hooks/async/claim-conditions";

// contract settings
export {
  usePrimarySaleRecipient,
  useUpdatePrimarySaleRecipient,
  useRoyaltySettings,
  useUpdateRoyaltySettings,
  usePlatformFees,
  useUpdatePlatformFees,
  useMetadata,
  useUpdateMetadata,
} from "./evm/hooks/async/contract-settings";

// contracts
export {
  useContractType,
  contractType,
  useCompilerMetadata,
  compilerMetadata,
  useContract,
  useContractMetadata,
  useContractMetadataUpdate,
  useContractEvents,
  useContractRead,
  useContractWrite,
} from "./evm/hooks/async/contracts";
export type { UseContractResult } from "./evm/hooks/async/contracts";

// drop
export {
  useUnclaimedNFTs,
  useClaimedNFTs,
  useUnclaimedNFTSupply,
  useClaimedNFTSupply,
  useBatchesToReveal,
  useClaimNFT,
  useLazyMint,
  useDelayedRevealLazyMint,
  useRevealLazyMint,
} from "./evm/hooks/async/drop";

// marketplace
export {
  useListing,
  useDirectListing,
  useEnglishAuction,
  useListings,
  useDirectListings,
  useValidDirectListings,
  useEnglishAuctions,
  useValidEnglishAuctions,
  useListingsCount,
  useDirectListingsCount,
  useEnglishAuctionsCount,
  useActiveListings,
  useWinningBid,
  useEnglishAuctionWinningBid,
  useAuctionWinner,
  useBidBuffer,
  useMinimumNextBid,
  useCreateDirectListing,
  useCreateAuctionListing,
  useCancelListing,
  useCancelDirectListing,
  useCancelEnglishAuction,
  useMakeBid,
  useMakeOffer,
  useAcceptDirectListingOffer,
  useExecuteAuctionSale,
  useOffers,
  useBuyNow,
} from "./evm/hooks/async/marketplace";

// nft
export {
  useNFT,
  useNFTs,
  useTotalCount,
  useTotalCirculatingSupply,
  useOwnedNFTs,
  useNFTBalance,
  useMintNFT,
  useMintNFTSupply,
  useTransferNFT,
  useAirdropNFT,
  useBurnNFT,
} from "./evm/hooks/async/nft";

// roles
export {
  useAllRoleMembers,
  useRoleMembers,
  useIsAddressRole,
  useSetAllRoleMembers,
  useGrantRole,
  useRevokeRole,
} from "./evm/hooks/async/roles";
export type {
  ContractWithRoles,
  RolesForContract,
} from "./evm/hooks/async/roles";

// token
export {
  useTokenSupply,
  useTokenBalance,
  useTokenDecimals,
  useMintToken,
  useClaimToken,
  useTransferToken,
  useTransferBatchToken,
  useBurnToken,
} from "./evm/hooks/async/token";

// thirdweb hooks (work as long as at least `<ThirdwebSdkProvider>` is used)

// auth hooks
export { useLogin, useLogout, useUser, useAuth } from "./evm/hooks/auth";
export type { UserWithData } from "./evm/hooks/auth";

// contract hooks
export {
  useEditionDrop,
  useEdition,
  useNFTDrop,
  useMarketplace,
  useNFTCollection,
  usePack,
  useToken,
  useTokenDrop,
  useVote,
  useSplit,
  useMultiwrap,
  useSignatureDrop,
} from "./evm/hooks/contracts";

// connected wallet hooks
export {
  useBalance,
  useConnectedWallet,
  useAddress,
  useChainId,
} from "./evm/hooks/wallet";

export { useStorageUpload, useStorage } from "./evm/hooks/storage";
export { useNetworkMismatch } from "./evm/hooks/useNetworkMismatch";
export { useReadonlySDK } from "./evm/hooks/useReadonlySDK";
export { useSigner } from "./evm/hooks/useSigner";
export { useSupportedChains } from "./evm/hooks/useSupportedChains";

// sdk provider
export {
  ThirdwebSDKProvider,
  useSDK,
  useSDKChainId,
} from "./evm/providers/thirdweb-sdk-provider";
export type { ThirdwebSDKProviderProps } from "./evm/providers/thirdweb-sdk-provider";

// types
export type {
  Chain,
  WalletAddress,
  TokenParams,
  TokenBurnParams,
  NFTContract,
  TokenContract,
  Erc721OrErc1155,
  TransferNFTParams,
  AirdropNFTParams,
  MintNFTSupplyParams,
  MintNFTParams,
  MintNFTReturnType,
  BurnNFTParams,
  DropContract,
  RevealableContract,
  DelayedRevealLazyMintInput,
  RevealLazyMintInput,
  ClaimNFTParams,
  ClaimNFTReturnType,
  MakeBidParams,
  MakeOfferParams,
  AcceptDirectOffer,
  ExecuteAuctionSale,
  BuyNowParams,
  ClaimTokenParams,
} from "./evm/types";
export { getErcs, getErc1155, getErc721, getErc20 } from "./evm/types";

// other

export { ThirdwebThemeContext } from "./core/providers/theme-context";
