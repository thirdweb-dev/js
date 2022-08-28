import { BigNumberish } from "ethers";
import { FileBufferOrString } from "../../schema";

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
  image?: FileBufferOrString;
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
  trusted_forwarders?: string[];
  /**
   * The address that will receive the proceeds from primary sales
   */
  primary_sale_recipient: string;
  /**
   * The address that will receive the proceeds from secondary sales (royalties)
   */
  fee_recipient?: string;
  /**
   * The percentage (in basis points) of royalties for secondary sales
   */
  seller_fee_basis_points?: number;
  /**
   * The address that will receive the proceeds from platform fees
   */
  platform_fee_recipient?: string;
  /**
   * The percentage (in basis points) of platform fees
   */
  platform_fee_basis_points?: number;
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
  image?: FileBufferOrString;
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
  trusted_forwarders?: string[];
  /**
   * The address that will receive the proceeds from primary sales
   */
  primary_sale_recipient: string;
  /**
   * The address that will receive the proceeds from platform fees
   */
  platform_fee_recipient?: string;
  /**
   * The percentage (in basis points) of platform fees
   */
  platform_fee_basis_points?: number;
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
  image?: FileBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: string[];
  /**
   * The address that will receive the proceeds from platform fees
   */
  platform_fee_recipient?: string;
  /**
   * The percentage (in basis points) of platform fees
   */
  platform_fee_basis_points?: number;
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
  image?: FileBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: string[];
  /**
   * The address of the governance token contract representing votes
   */
  voting_token_address: string;
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
  proposal_token_threshold?: BigNumberish;
  /**
   * The minimum fraction to be met to pass a proposal
   */
  voting_quorum_fraction?: number;
}

/**
 * @public
 */
export interface SplitRecipientInput {
  /**
   * The recipient address
   */
  address: string;
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
  image?: FileBufferOrString;
  /**
   * Optional url for the contract
   */
  external_link?: string;
  /**
   * Custom gasless trusted forwarder addresses
   */
  trusted_forwarders?: string[];
  /**
   * The list of recipients and their share of the split
   */
  recipients: SplitRecipientInput[];
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
  image?: FileBufferOrString;
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
  trusted_forwarders?: string[];
  /**
   * The address that will receive the proceeds from secondary sales (royalties)
   */
  fee_recipient?: string;
  /**
   * The percentage (in basis points) of royalties for secondary sales
   */
  seller_fee_basis_points?: number;
}
