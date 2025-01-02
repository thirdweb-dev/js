import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import type { ClaimToParams as ClaimToParams721 } from "../../../../../../extensions/erc721/drops/write/claimTo.js";
import type { ClaimToParams as ClaimToParams1155 } from "../../../../../../extensions/erc1155/drops/write/claimTo.js";
import type { TransactionButtonProps } from "../../../../../core/hooks/transaction/transaction-button-utils.js";

export type Erc721ClaimParams = Omit<ClaimToParams721, "to"> & {
  type: "ERC721";
  to?: string;
};

export type Erc1155ClaimParams = Omit<ClaimToParams1155, "to"> & {
  type: "ERC1155";
  to?: string;
};

export type Erc20ClaimParams = {
  type: "ERC20";
  to?: string;
  from?: string;
} & ({ quantityInWei: bigint } | { quantity: string });

export type ClaimParams =
  | Erc721ClaimParams
  | Erc1155ClaimParams
  | Erc20ClaimParams;

/**
 * Props for the ClaimButton component
 */
export type ClaimButtonProps = Omit<TransactionButtonProps, "transaction"> & {
  /**
   * The contract address of the Drop contract.
   * Make sure it's a valid [thirdweb Drop contracts:](https://thirdweb.com/explore/drops)
   */
  contractAddress: string;
  /**
   * The chain which the Drop contract is deployed on
   */
  chain: Chain;
  /**
   * thirdweb Client
   */
  client: ThirdwebClient;
  /**
   *
   */
  claimParams: ClaimParams;
};
