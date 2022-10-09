// handle browser vs node global
globalThis.global = globalThis;

export type {
  NFTMetadataInput,
  NFT,
  NFTMetadata,
  NFTMetadataOrUri,
} from "./core/schema/nft";

export type { CurrencyValue, TokenMetadata } from "./core/schema/token";

// export EVM by default
export * from "./evm";
