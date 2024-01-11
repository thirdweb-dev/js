export { resolveMimeType } from "../core/utils/ipfs";

export { ThirdwebThemeContext } from "../core/providers/theme-context";
export { ThirdwebProviderCore } from "../core/providers/thirdweb-provider";
export type { ThirdwebProviderCoreProps } from "../core/providers/thirdweb-provider";

// constants
export { __DEV__ } from "../core/constants/runtime";

// wallet hooks
export {
  type WalletIdToWalletTypeMap,
  useWallet,
  useConnect,
  useConnectionStatus,
  useCreateWalletInstance,
  useDisconnect,
  useSwitchChain,
  useWallets,
  useWalletConfig,
  useSetConnectionStatus,
  useSetConnectedWallet,
} from "../core/hooks/wallet-hooks";
export { useNetwork } from "../core/hooks/useNetwork";
export { useWalletContext } from "../core/providers/thirdweb-wallet-provider";
export { usePersonalWalletAddress } from "./hooks/usePersonalWalletAddress";
export { useWalletConnectHandler } from "../core/providers/thirdweb-wallet-provider";
export type { ConnectionStatus } from "../core/providers/thirdweb-wallet-provider";

// connected wallet hooks
export {
  useBalance,
  useConnectedWallet,
  useAddress,
  useChainId,
  useActiveChain,
  useChain,
  useBalanceForAddress,
} from "./hooks/wallet";

// Utilities and Others
export { shouldNeverPersistQuery } from "../core/query-utils/query-key";
export type { RequiredParam } from "../core/query-utils/required-param";
export type {
  WalletConfig,
  ConnectUIProps,
  SelectUIProps,
  WalletInstance,
  WalletOptions,
} from "../core/types/wallet";

// auth
export { useThirdwebAuthContext } from "./contexts/thirdweb-auth";
export { ThirdwebAuthProvider } from "./contexts/ThirdwebAuthProvider";
export type {
  ThirdwebAuthConfig,
  ISecureStorage,
} from "./contexts/thirdweb-auth";

// config
export {
  ThirdwebConfigProvider,
  useThirdwebConfigContext,
} from "./contexts/thirdweb-config";

// connected wallet provider
export {
  ThirdwebConnectedWalletProvider,
  useThirdwebConnectedWalletContext,
} from "./contexts/thirdweb-wallet";

// claim conditions
export type {
  ClaimIneligibilityParams,
  SetClaimConditionsParams,
} from "./hooks/async/claim-conditions";
export {
  useActiveClaimCondition,
  useClaimerProofs,
  useClaimConditions,
  useClaimIneligibilityReasons,
  useActiveClaimConditionForWallet,
  useSetClaimConditions,
  useResetClaimConditions,
} from "./hooks/async/claim-conditions";

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
} from "./hooks/async/contract-settings";

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
} from "./hooks/async/contracts";
export type { UseContractResult } from "./hooks/async/contracts";

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
} from "./hooks/async/drop";

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
  useBuyDirectListing,
  useCreateDirectListingBatch,
} from "./hooks/async/marketplace";

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
  useSharedMetadata,
  useSetSharedMetadata,
} from "./hooks/async/nft";

// roles
export {
  useAllRoleMembers,
  useRoleMembers,
  useIsAddressRole,
  useSetAllRoleMembers,
  useGrantRole,
  useRevokeRole,
} from "./hooks/async/roles";
export type { ContractWithRoles, RolesForContract } from "./hooks/async/roles";

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
  useTransferNativeToken,
} from "./hooks/async/token";

// account factory
export {
  useIsAccountDeployed,
  useAccounts,
  useCreateAccount,
  useAccountsForAddress,
} from "./hooks/async/account-factory";

// account
export {
  useAccountSigners,
  useAddAdmin,
  useRemoveAdmin,
  useCreateSessionKey,
  useRevokeSessionKey,
  useAccountAdmins,
  useAccountAdminsAndSigners,
} from "./hooks/async/account";

// thirdweb hooks (work as long as at least `<ThirdwebSdkProvider>` is used)

// auth hooks
export { useAuth } from "./hooks/auth/useAuth";
export { useLogin } from "./hooks/auth/useLogin";
export { useLogout } from "./hooks/auth/useLogout";
export { useUser } from "./hooks/auth/useUser";
export { useSwitchAccount } from "./hooks/auth/useSwitchAccount";

export type { UserWithData } from "./hooks/auth/useUser";

// contract hooks
export { useEditionDrop } from "./hooks/contracts/useEditionDrop";
export { useEdition } from "./hooks/contracts/useEdition";
export { useNFTDrop } from "./hooks/contracts/useNFTDrop";
export { useMarketplace } from "./hooks/contracts/useMarketplace";
export { useNFTCollection } from "./hooks/contracts/useNFTCollection";
export { usePack } from "./hooks/contracts/usePack";
export { useToken } from "./hooks/contracts/useToken";
export { useTokenDrop } from "./hooks/contracts/useTokenDrop";
export { useVote } from "./hooks/contracts/useVote";
export { useSplit } from "./hooks/contracts/useSplit";
export { useMultiwrap } from "./hooks/contracts/useMultiwrap";
export { useSignatureDrop } from "./hooks/contracts/useSignatureDrop";

export { useStorage } from "./hooks/storage/useStorage";
export { useStorageUpload } from "./hooks/storage/useStorageUpload";
export { useNetworkMismatch } from "./hooks/useNetworkMismatch";
export { useReadonlySDK } from "./hooks/useReadonlySDK";
export { useSigner } from "./hooks/useSigner";
export { useSupportedChains } from "./hooks/useSupportedChains";
export { useSupportedWallet } from "./hooks/useSupportedWallet";
export { useAppURI, useSetAppURI } from "./hooks/async/app";
export { useENS } from "./hooks/useENS";

// sdk provider
export { ThirdwebSDKProvider } from "./providers/thirdweb-sdk-provider";
export { useSDK, useSDKChainId } from "./hooks/useSDK";
export type { ThirdwebSDKProviderProps } from "./providers/types";

// utils
export { invalidateContractAndBalances } from "./utils/cache-keys";
export {
  isEnsName,
  isPossibleEVMAddress,
  shortenAddress,
  shortenIfAddress,
  shortenString,
} from "./utils/addresses";

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
} from "./types";
export { getErcs, getErc1155, getErc721, getErc20 } from "./types";

// transaction hooks
export { useWatchTransactions } from "./hooks/useTransactions";
export type { UseWatchTransactionsParams } from "./hooks/useTransactions";
