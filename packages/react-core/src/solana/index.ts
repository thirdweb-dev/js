// Providers
export { ThirdwebSDKProvider, useSDK } from "./providers/base";

/**
 * Hooks
 */
// Program
export { programQuery, useProgram } from "./hooks/program/useProgram";
export type { UseProgramResult } from "./hooks/program/useProgram";

export {
  programMetadataQuery,
  useProgramMetadata,
} from "./hooks/program/useProgramMetadata";

export {
  programAccountTypeQuery,
  useProgramAccountType,
} from "./hooks/program/useProgramAccountType";

// NFT Shared
export { nftGetAllQuery, useNFTs } from "./hooks/nft/useNFTs";
export { useTransferNFT } from "./hooks/nft/useTransferNFT";
export type { TransferNFTMutationParams } from "./hooks/nft/useTransferNFT";

export { useBurnNFT } from "./hooks/nft/useBurnNFT";
export {
  nftRoyaltyQuery,
  useRoyaltySettings,
} from "./hooks/nft/useRoyaltySettings";
export { useUpdateRoyaltySettings } from "./hooks/nft/useUpdateRoyaltySettings";
export { nftCreatorsQuery, useCreators } from "./hooks/nft/useCreators";
export { useUpdateCreators } from "./hooks/nft/useUpdateCreators";
export {
  nftTotalSupplyQuery,
  useTotalSupply,
} from "./hooks/nft/useTotalSupply";

// NFT Collection
export { useMintNFT } from "./hooks/nft/collection/useMintNFT";
export { useMintNFTSupply } from "./hooks/nft/collection/useMintNFTSupply";

// NFT Drop
export { useLazyMint } from "./hooks/nft/drop/useLazyMint";
export {
  dropTotalClaimedSupplyQuery,
  useDropTotalClaimedSupply,
} from "./hooks/nft/drop/useClaimedSupply";
export {
  dropUnclaimedSupplyQuery,
  useDropUnclaimedSupply,
} from "./hooks/nft/drop/useUnclaimedSupply";
export { useClaimNFT } from "./hooks/nft/drop/useClaimNFT";
export {
  claimConditionsQuery,
  useClaimConditions,
} from "./hooks/nft/drop/useClaimConditions";
export { useSetClaimConditions } from "./hooks/nft/drop/useSetClaimConditions";

// Token
export { tokenSupplyQuery, useTokenSupply } from "./hooks/token/useTokenSupply";
export {
  tokenBalanceQuery,
  useTokenBalance,
} from "./hooks/token/useTokenBalance";
export { useMintToken } from "./hooks/token/useMintToken";
export type { TransferTokenMutationParams } from "./hooks/token/useTransferToken";
export { useTransferToken } from "./hooks/token/useTransferToken";

// Auth
export { useLogin, useLogout, useUser } from "./hooks/auth";
export type { UserWithData, LoginConfig } from "./hooks/auth";

//Wallet
export { balanceQuery, useBalance } from "./hooks/wallet/useBalance";

//Contexts
export type { ThirdwebAuthConfig } from "./contexts/thirdweb-auth";
export {
  ThirdwebAuthProvider,
  useThirdwebAuthContext,
} from "./contexts/thirdweb-auth";

// Utilities and Others
export { shouldNeverPersistQuery } from "../core/query-utils/query-key";
export type { RequiredParam } from "../core/query-utils/required-param";
