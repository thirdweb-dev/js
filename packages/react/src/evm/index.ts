// export * from "./hooks/connectors/useMetamask";
// export * from "./hooks/connectors/useWalletConnect";
// export * from "./hooks/connectors/useWalletLink";
// require to be inside `<ThirdwebProvider />`
// export * from "./hooks/wagmi-required/useAccount";
// export * from "./hooks/wagmi-required/useConnect";
// export * from "./hooks/wagmi-required/useDisconnect";
// export * from "./hooks/wagmi-required/useNetwork";

// export these from core directly

export { ConnectWallet } from "../wallet/ConnectWallet/ConnectWallet";
// ui components
export * from "./components/MediaRenderer";
export * from "./components/NftMedia";
export * from "./components/Web3Button";
export { ThirdwebProvider } from "./providers/thirdweb-provider";

// react-core ------------------------------------

export { __DEV__ } from "@thirdweb-dev/react-core";

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
  useAccountAddress,
} from "@thirdweb-dev/react-core";
export {
  useDeviceWalletStorage,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";

// Utilities and Others
export { shouldNeverPersistQuery } from "@thirdweb-dev/react-core";
export type { RequiredParam } from "@thirdweb-dev/react-core";
export type { SupportedWallet } from "@thirdweb-dev/react-core";

// auth
export {
  ThirdwebAuthProvider,
  useThirdwebAuthContext,
} from "@thirdweb-dev/react-core";
export type { ThirdwebAuthConfig } from "@thirdweb-dev/react-core";

// config
export {
  ThirdwebConfigProvider,
  useThirdwebConfigContext,
} from "@thirdweb-dev/react-core";

// connected wallet provider
export {
  ThirdwebConnectedWalletProvider,
  useThirdwebConnectedWalletContext,
} from "@thirdweb-dev/react-core";

// claim conditions
export type {
  ClaimIneligibilityParams,
  SetClaimConditionsParams,
} from "@thirdweb-dev/react-core";
export {
  useActiveClaimCondition,
  useClaimerProofs,
  useClaimConditions,
  useClaimIneligibilityReasons,
  useActiveClaimConditionForWallet,
  useSetClaimConditions,
  useResetClaimConditions,
} from "@thirdweb-dev/react-core";

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
} from "@thirdweb-dev/react-core";

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
} from "@thirdweb-dev/react-core";
export type { UseContractResult } from "@thirdweb-dev/react-core";

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
} from "@thirdweb-dev/react-core";

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
} from "@thirdweb-dev/react-core";

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
} from "@thirdweb-dev/react-core";

// roles
export {
  useAllRoleMembers,
  useRoleMembers,
  useIsAddressRole,
  useSetAllRoleMembers,
  useGrantRole,
  useRevokeRole,
} from "@thirdweb-dev/react-core";
export type {
  ContractWithRoles,
  RolesForContract,
} from "@thirdweb-dev/react-core";

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
} from "@thirdweb-dev/react-core";

// thirdweb hooks (work as long as at least `<ThirdwebSdkProvider>` is used)

// auth hooks
export {
  useLogin,
  useLogout,
  useUser,
  useAuth,
} from "@thirdweb-dev/react-core";
export type { UserWithData } from "@thirdweb-dev/react-core";

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
} from "@thirdweb-dev/react-core";

// connected wallet hooks
export {
  useBalance,
  useConnectedWallet,
  useAddress,
  useChainId,
} from "@thirdweb-dev/react-core";

export { useStorageUpload, useStorage } from "@thirdweb-dev/react-core";
export { useNetworkMismatch } from "@thirdweb-dev/react-core";
export { useReadonlySDK } from "@thirdweb-dev/react-core";
export { useSigner } from "@thirdweb-dev/react-core";
export { useSupportedChains } from "@thirdweb-dev/react-core";

// sdk provider
export {
  ThirdwebSDKProvider,
  useSDK,
  useSDKChainId,
} from "@thirdweb-dev/react-core";
export type { ThirdwebSDKProviderProps } from "@thirdweb-dev/react-core";

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
} from "@thirdweb-dev/react-core";

export {
  getErcs,
  getErc1155,
  getErc721,
  getErc20,
} from "@thirdweb-dev/react-core";
