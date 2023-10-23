// handle browser vs node global
// eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
globalThis.global = globalThis;

export type { ContractType } from "./contracts";

export type { Role } from "./common/role";

export * from "./schema/contracts/custom";
export * from "./schema/contracts/common/claim-conditions";
export * from "./schema/tokens/common/properties";
export * from "./schema/tokens/token";
export * from "./schema/tokens/edition";
export * from "./schema/contracts/common";

// shared
export * from "./schema/shared/BigNumberSchema";
export * from "./schema/shared/AddressSchema";
export * from "./schema/shared/AddressOrEnsSchema";
export * from "./schema/shared/RawDateSchema";
export * from "./schema/shared/CallOverrideSchema";
export * from "./schema/shared/ChainInfo";
export * from "./schema/shared/Ens";
export * from "./schema/shared/Address";

export type {
  SDKOptions,
  SDKOptionsSchema,
  SDKOptionsOutput,
} from "./schema/sdk-options";

export * from "./types";
export * from "./enums";
export * from "./contracts";

export { StaticJsonRpcBatchProvider } from "./lib/static-batch-rpc";

// export integration things
export * from "./integrations/thirdweb-checkout";

// explicitly export the *TYPES* of prebuilt contracts
export type { Edition } from "./contracts/prebuilt-implementations/edition";
export type { EditionDrop } from "./contracts/prebuilt-implementations/edition-drop";
export type { Marketplace } from "./contracts/prebuilt-implementations/marketplace";
export type { MarketplaceV3 } from "./contracts/prebuilt-implementations/marketplacev3";
export type { Multiwrap } from "./contracts/prebuilt-implementations/multiwrap";
export type { NFTCollection } from "./contracts/prebuilt-implementations/nft-collection";
export type { NFTDrop } from "./contracts/prebuilt-implementations/nft-drop";
export type { Pack } from "./contracts/prebuilt-implementations/pack";
export type { SignatureDrop } from "./contracts/prebuilt-implementations/signature-drop";
export type { Split } from "./contracts/prebuilt-implementations/split";
export type { Token } from "./contracts/prebuilt-implementations/token";
export type { TokenDrop } from "./contracts/prebuilt-implementations/token-drop";
export type { Vote } from "./contracts/prebuilt-implementations/vote";
export type { SmartContract } from "./contracts/smart-contract";

// re-export from functions entry point
export * from "./functions";

// marketplace v3 types
export type { DirectListingInputParams } from "./schema/marketplacev3/direct-listings";
export type { EnglishAuctionInputParams } from "./schema/marketplacev3/english-auctions";

//#region @r/packages/sdk/src/evm/core
export * from "./core/types";
export * from "./core/classes/contract-encoder";
export * from "./core/classes/contract-metadata";
export * from "./core/classes/contract-roles";
export * from "./core/classes/contract-royalty";
export * from "./core/classes/contract-sales";
export * from "./core/classes/delayed-reveal";
export * from "./core/classes/drop-claim-conditions";
export * from "./core/classes/drop-erc1155-claim-conditions";
export * from "./core/classes/drop-erc1155-history";
export * from "./core/classes/erc-20-batch-mintable";
export * from "./core/classes/erc-20-burnable";
export * from "./core/classes/erc-20-claim-conditions";
export * from "./core/classes/erc-20-droppable";
export * from "./core/classes/erc-20-mintable";
export * from "./core/classes/erc-20-signature-mintable";
export * from "./core/classes/erc-20";
export * from "./core/classes/erc-20-history";
export * from "./core/classes/erc-20-standard";
export * from "./core/classes/erc-721-batch-mintable";
export * from "./core/classes/erc-721-claim-conditions";
export * from "./core/classes/erc-721-claimable";
export * from "./core/classes/erc-721-lazy-mintable";
export * from "./core/classes/erc-721-mintable";
export * from "./core/classes/erc-721-supply";
export * from "./core/classes/erc-721-enumerable";
export * from "./core/classes/erc-721-tiered-drop";
export * from "./core/classes/erc-721";
export * from "./core/classes/erc-721-with-quantity-signature-mintable";
export * from "./core/classes/erc-721-burnable";
export * from "./core/classes/erc-721-standard";
export * from "./core/classes/erc-1155-batch-mintable";
export * from "./core/classes/erc-1155-burnable";
export * from "./core/classes/erc-1155-enumerable";
export * from "./core/classes/erc-1155-lazy-mintable";
export * from "./core/classes/erc-1155-mintable";
export * from "./core/classes/erc-1155";
export * from "./core/classes/erc-1155-signature-mintable";
export * from "./core/classes/erc-1155-standard";
export * from "./core/classes/marketplace-direct";
export * from "./core/classes/marketplace-auction";
export * from "./core/classes/marketplacev3-direct-listings";
export * from "./core/classes/marketplacev3-english-auction";
export * from "./core/classes/marketplacev3-offers";
export * from "./core/classes/gas-cost-estimator";
export * from "./core/classes/delayed-reveal";
export * from "./core/classes/contract-events";
export * from "./core/classes/contract-interceptor";
export * from "./core/classes/contract-platform-fee";
export * from "./core/classes/contract-published-metadata";
export * from "./core/classes/contract-owner";
export * from "./core/classes/transactions";
export * from "./core/classes/contract-appuri";
export * from "./core/classes/account";
export * from "./core/classes/account-factory";
export * from "./core/wallet/user-wallet";
export * from "./core/sdk";
//#endregion @r/packages/sdk/src/evm/core

//#region @r/packages/sdk/src/evm/common/*
export * from "./common/error";
export * from "./common/snapshots";
export * from "./common/role";
export * from "./common/metadata-resolver";
export * from "./common/gas-price";
export * from "./common/fetchContractMetadata";
export * from "./common/feature-detection/matchesPrebuiltAbi";
export * from "./common/feature-detection/hasMatchingAbi";
export * from "./common/feature-detection/extractConstructorParams";
export * from "./common/feature-detection/extractFunctions";
export * from "./common/feature-detection/extractCommentFromMetadata";
export * from "./common/feature-detection/extractConstructorParamsFromAbi";
export * from "./common/feature-detection/extractFunctionParamsFromAbi";
export * from "./common/feature-detection/extractFunctionsFromAbi";
export * from "./common/feature-detection/extractEventsFromAbi";
export * from "./common/feature-detection/extractMinimalProxyImplementationAddress";
export * from "./common/feature-detection/resolveContractUriFromAddress";
export * from "./common/feature-detection/extractIPFSHashFromBytecode";
export * from "./common/feature-detection/fetchRawPredeployMetadata";
export * from "./common/feature-detection/fetchPreDeployMetadata";
export * from "./common/feature-detection/fetchExtendedReleaseMetadata";
export * from "./common/feature-detection/detectFeatures";
export * from "./common/feature-detection/getAllDetectedFeatures";
export * from "./common/feature-detection/getAllDetectedFeatureNames";
export * from "./common/feature-detection/isFeatureEnabled";
export * from "./common/feature-detection/assertEnabled";
export * from "./common/feature-detection/detectContractFeature";
export * from "./common/feature-detection/hasFunction";
export * from "./common/plugin/joinABIs";
export * from "./common/plugin/getCompositePluginABI";
export * from "./common/version-checker";
export * from "./common/fetchSourceFilesFromMetadata";
export { isNativeToken } from "./common/currency/isNativeToken";
export { cleanCurrencyAddress } from "./common/currency/cleanCurrencyAddress";
export { normalizePriceValue } from "./common/currency/normalizePriceValue";
export { fetchCurrencyMetadata } from "./common/currency/fetchCurrencyMetadata";
export { fetchCurrencyValue } from "./common/currency/fetchCurrencyValue";
export { setErc20Allowance } from "./common/currency/setErc20Allowance";
export { approveErc20Allowance } from "./common/currency/approveErc20Allowance";
export { hasERC20Allowance } from "./common/currency/hasERC20Allowance";
export { normalizeAmount } from "./common/currency/normalizeAmount";
export { toEther } from "./common/currency/toEther";
export { toWei } from "./common/currency/toWei";
export { toUnits } from "./common/currency/toUnits";
export { toDisplayValue } from "./common/currency/toDisplayValue";
export * from "./common/verification";
export * from "./common/any-evm-utils/constants";
export * from "./common/any-evm-utils/isContractDeployed";
export * from "./common/any-evm-utils/isEIP155Enforced";
export * from "./common/any-evm-utils/getCreate2FactoryAddress";
export * from "./common/any-evm-utils/getSaltHash";
export * from "./common/any-evm-utils/getInitBytecodeWithSalt";
export * from "./common/any-evm-utils/computeDeploymentAddress";
export * from "./common/any-evm-utils/computeEOAForwarderAddress";
export * from "./common/any-evm-utils/computeForwarderAddress";
export * from "./common/any-evm-utils/computeCloneFactoryAddress";
export * from "./common/any-evm-utils/computeNativeTokenAddress";
export * from "./common/any-evm-utils/getThirdwebContractAddress";
export * from "./common/any-evm-utils/predictThirdwebContractAddress";
export * from "./common/any-evm-utils/getEncodedConstructorParamsForThirdwebContract";
export * from "./common/any-evm-utils/getKeylessTxn";
export * from "./common/any-evm-utils/deployCreate2Factory";
export * from "./common/any-evm-utils/deployDirectDeterministic";
export * from "./common/any-evm-utils/deployContractDeterministicRaw";
export * from "./common/any-evm-utils/deployContractDeterministic";
export * from "./common/any-evm-utils/getDeploymentInfo";
export * from "./common/any-evm-utils/deployWithThrowawayDeployer";
export * from "./common/any-evm-utils/computeDeploymentInfo";
export * from "./common/any-evm-utils/convertParamValues";
export * from "./common/any-evm-utils/getCreate2FactoryDeploymentInfo";
export * from "./common/any-evm-utils/fetchPublishedContractFromPolygon";
export * from "./common/any-evm-utils/fetchAndCacheDeployMetadata";
export * from "./common/any-evm-utils/estimateGasForDeploy";
export * from "./common/any-evm-utils/createTransactionBatches";
export * from "./common/deploy";
export { convertToReadableQuantity } from "./common/claim-conditions/convertToReadableQuantity";
export { fetchSnapshotEntryForAddress } from "./common/claim-conditions/fetchSnapshotEntryForAddress";
export { getCachedAbiForContract } from "./common/abi";
export * from "./common/ens/resolveEns";
export * from "./common/ens/resolveAddress";
//#endregion @r/packages/sdk/src/evm/common/*

//#region @r/packages/sdk/src/evm/constants/*
export * from "./constants/addresses/LOCAL_NODE_PKEY";
export * from "./constants/addresses/CONTRACT_ADDRESSES";
export * from "./constants/addresses/APPROVED_IMPLEMENTATIONS";
export * from "./constants/addresses/getApprovedImplementation";
export * from "./constants/addresses/getContractAddressByChainId";
export * from "./constants/addresses/getContractPublisherAddress";
export * from "./constants/addresses/getMultichainRegistryAddress";
export * from "./constants/addresses/getDefaultTrustedForwarders";
export * from "./constants/chains/ChainId";
export * from "./constants/chains/SUPPORTED_CHAIN_ID";
export * from "./constants/chains/SUPPORTED_CHAIN_IDS";
export * from "./constants/chains/supportedChains";
export * from "./constants/contract";
export * from "./constants/currency";
export * from "./constants/events";
export * from "./constants/urls";
export * from "./constants/contract-features";
//#endregion @r/packages/sdk/src/evm/constants/*


