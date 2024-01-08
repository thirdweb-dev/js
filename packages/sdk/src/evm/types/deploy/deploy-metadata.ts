import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { FileOrBufferOrString } from "@thirdweb-dev/storage";
import type { BigNumberish, Bytes } from "ethers";
import { CommonContractSchemaInput } from "../../schema/contracts/common";

/**
 * Options for deploying an NFT contract
 * @public
 */
export interface NFTContractDeployMetadata {
  /**
   * name of the contract
   */
  name: string;
  /**
   * Optional description of the contract
   */
  description?: string;
  /**
   * Optional image for the contract
   */
  image?: FileOrBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Symbol for the NFTs
   */
  symbol?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: AddressOrEns[];
  /**
   * The address that will receive the proceeds from primary sales
   */
  primary_sale_recipient?: AddressOrEns;
  /**
   * The address that will receive the proceeds from secondary sales (royalties)
   */
  fee_recipient?: AddressOrEns;
  /**
   * The percentage (in basis points) of royalties for secondary sales
   */
  seller_fee_basis_points?: number;
  /**
   * The address that will receive the proceeds from platform fees
   */
  platform_fee_recipient?: AddressOrEns;
  /**
   * The percentage (in basis points) of platform fees
   */
  platform_fee_basis_points?: number;

  /**
   * The default app for this contract
   */
  app_uri?: string;
}

/**
 * Options for deploying an OpenEdition contract
 * @public
 */
export interface OpenEditionContractDeployMetadata {
  /**
   * name of the contract
   */
  name: string;
  /**
   * Optional description of the contract
   */
  description?: string;
  /**
   * Optional image for the contract
   */
  image?: FileOrBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Symbol for the NFTs
   */
  symbol?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: AddressOrEns[];
  /**
   * The address that will receive the proceeds from primary sales
   */
  primary_sale_recipient?: AddressOrEns;
  /**
   * The address that will receive the proceeds from secondary sales (royalties)
   */
  fee_recipient?: AddressOrEns;
  /**
   * The percentage (in basis points) of royalties for secondary sales
   */
  seller_fee_basis_points?: number;
  /**
   * The default app for this contract
   */
  app_uri?: string;
}

/**
 * Options for deploying a Token contract
 * @public
 */
export interface TokenContractDeployMetadata {
  /**
   * name of the contract
   */
  name: string;
  /**
   * Optional description of the contract
   */
  description?: string;
  /**
   * Optional image for the contract
   */
  image?: FileOrBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Symbol for the NFTs
   */
  symbol?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: AddressOrEns[];
  /**
   * The address that will receive the proceeds from primary sales
   */
  primary_sale_recipient?: AddressOrEns;
  /**
   * The address that will receive the proceeds from platform fees
   */
  platform_fee_recipient?: AddressOrEns;
  /**
   * The percentage (in basis points) of platform fees
   */
  platform_fee_basis_points?: number;

  /**
   * The default app for this contract
   */
  app_uri?: string;
}

/**
 * Options for deploying a Marketplace contract
 * @public
 */
export interface MarketplaceContractDeployMetadata {
  /**
   * name of the contract
   */
  name: string;
  /**
   * Optional description of the contract
   */
  description?: string;
  /**
   * Optional image for the contract
   */
  image?: FileOrBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: AddressOrEns[];
  /**
   * The address that will receive the proceeds from platform fees
   */
  platform_fee_recipient?: AddressOrEns;
  /**
   * The percentage (in basis points) of platform fees
   */
  platform_fee_basis_points?: number;

  /**
   * The default app for this contract
   */
  app_uri?: string;
}

/**
 * Options for deploying a Marketplace-V3 contract
 * @public
 */
export interface MarketplaceV3ContractDeployMetadata {
  /**
   * name of the contract
   */
  name: string;
  /**
   * Optional description of the contract
   */
  description?: string;
  /**
   * Optional image for the contract
   */
  image?: FileOrBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: AddressOrEns[];
  /**
   * The address that will receive the proceeds from platform fees
   */
  platform_fee_recipient?: AddressOrEns;
  /**
   * The percentage (in basis points) of platform fees
   */
  platform_fee_basis_points?: number;
  /**
   * The default app for this contract
   */
  app_uri?: string;
}

/**
 * Options for deploying a Vote contract
 * @public
 */
export interface VoteContractDeployMetadata {
  /**
   * name of the contract
   */
  name: string;
  /**
   * Optional description of the contract
   */
  description?: string;
  /**
   * Optional image for the contract
   */
  image?: FileOrBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: AddressOrEns[];
  /**
   * The address of the governance token contract representing votes
   */
  voting_token_address: AddressOrEns;
  /**
   * The delay in blocks before voting can begin on proposals
   * Specified in number of blocks. Assuming block time of around 13.14 seconds, 1 day = 6570 blocks, 1 week = 45992 blocks.
   */
  voting_delay_in_blocks?: number;
  /**
   * The duration in blocks of the open voting window
   * Specified in number of blocks. Assuming block time of around 13.14 seconds, 1 day = 6570 blocks, 1 week = 45992 blocks.
   */
  voting_period_in_blocks?: number;
  /**
   * The minimum amount in governance token owned to be able to create a proposal
   */
  proposal_token_threshold?: Exclude<BigNumberish, Bytes>;
  /**
   * The minimum fraction to be met to pass a proposal
   */
  voting_quorum_fraction?: number;
  /**
   * The default app for this contract
   */
  app_uri?: string;
}

/**
 * @public
 */
export interface SplitRecipientInput {
  /**
   * The recipient address
   */
  address: AddressOrEns;
  /**
   * the shares in basis point (5% = 500) that address is owed from the total funds
   */
  sharesBps: number;
}

/**
 * Options for deploying Split contract
 * @public
 */
export interface SplitContractDeployMetadata {
  /**
   * name of the contract
   */
  name: string;
  /**
   * Optional description of the contract
   */
  description?: string;
  /**
   * Optional image for the contract
   */
  image?: FileOrBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: AddressOrEns[];
  /**
   * The list of recipients and their share of the split
   */
  recipients: SplitRecipientInput[];
  /**
   * The default app for this contract
   */
  app_uri?: string;
}

/**
 * Options for deploying an Multiwrap contract
 * @public
 */
export interface MultiwrapContractDeployMetadata {
  /**
   * name of the contract
   */
  name: string;
  /**
   * Optional description of the contract
   */
  description?: string;
  /**
   * Optional image for the contract
   */
  image?: FileOrBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Symbol for the NFTs
   */
  symbol?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: AddressOrEns[];
  /**
   * The address that will receive the proceeds from secondary sales (royalties)
   */
  fee_recipient?: AddressOrEns;
  /**
   * The percentage (in basis points) of royalties for secondary sales
   */
  seller_fee_basis_points?: number;
  /**
   * The default app for this contract
   */
  app_uri?: string;
}

/**
 * Options for deploying Airdrop contract
 * @public
 */
export interface AirdropContractDeployMetadata {
  /**
   * name of the contract
   */
  name: string;
  /**
   * Optional description of the contract
   */
  description?: string;
  /**
   * Optional image for the contract
   */
  image?: FileOrBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: AddressOrEns[];
  /**
   * The default app for this contract
   */
  app_uri?: string;
}

/**
 * @public
 */
export type DynamicContractExtensionMetadataOrUri =
  | CommonContractSchemaInput
  | string;
