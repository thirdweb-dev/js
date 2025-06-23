"use client";

import { useCallback } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { getContract } from "../../../../../../contract/contract.js";
import { getListing } from "../../../../../../extensions/marketplace/direct-listings/read/getListing.js";
import type { BaseTransactionOptions } from "../../../../../../transaction/types.js";
import { useReadContract } from "../../../../../core/hooks/contract/useReadContract.js";
import type { TransactionButtonProps } from "../../../../../core/hooks/transaction/transaction-button-utils.js";
import { useSendAndConfirmTransaction } from "../../../../../core/hooks/transaction/useSendAndConfirmTransaction.js";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { TransactionButton } from "../../../TransactionButton/index.js";

export type BuyDirectListingButtonProps = Omit<
  TransactionButtonProps,
  "transaction"
> & {
  /**
   * The contract address of the Marketplace v3 contract.
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
   * ID of the marketplace's DirectListing
   */
  listingId: bigint;

  /**
   * Qty to buy (optional)
   *
   * - For ERC721 listing: the `quantity` is always hard-coded to 1n - passing this props doesn't do anything
   *
   * - For ERC1155 listing: the `quantity` defaults to the quantity of the listing if not specified.
   *
   * The component will also throw an error if  you pass a `quantity` and it's greater than the listing's quantity
   */
  quantity?: bigint;
};

/**
 * This button is used with thirdweb Marketplace v3 contract, for buying NFT(s) from a listing.
 *
 * Under the hood, it prepares a transaction using the [`buyFromListing` extension](https://portal.thirdweb.com/references/typescript/v5/marketplace/buyFromListing)
 * and then pass it to a <TransactionButton />
 *
 * Since it uses the TransactionButton, it can take in any props that can be passed
 * to the [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton)
 *
 * @param props props of type [BuyDirectListingButtonProps](https://portal.thirdweb.com/references/typescript/v5/BuyDirectListingButtonProps)
 * @example
 * ```tsx
 * import { BuyDirectListingButton } from "thirdweb/react";
 *
 * <BuyDirectListingButton
 *   contractAddress="0x..." // contract address of the marketplace v3
 *   chain={...} // the chain which the marketplace contract is deployed on
 *   client={...} // thirdweb client
 *   listingId={100n} // the listingId or the item you want to buy
 *   quantity={1n} // optional - see the docs to learn more
 * >
 *   Buy NFT
 * </BuyDirectListingButton>
 * ```
 *
 * For error handling & callbacks on transaction-sent and transaction-confirmed,
 * please refer to the TransactionButton docs.
 * @component
 * @transaction
 */
export function BuyDirectListingButton(props: BuyDirectListingButtonProps) {
  const {
    contractAddress,
    listingId,
    children,
    chain,
    client,
    quantity,
    payModal,
  } = props;
  const defaultPayModalMetadata = payModal ? payModal.metadata : undefined;
  const account = useActiveAccount();
  const contract = getContract({
    address: contractAddress,
    chain,
    client,
  });

  const { data: payMetadata } = useReadContract(getPayMetadata, {
    contract,
    listingId,
    queryOptions: {
      enabled: !defaultPayModalMetadata,
    },
  });

  const { mutateAsync } = useSendAndConfirmTransaction();

  const prepareBuyTransaction = useCallback(async () => {
    if (!account) {
      throw new Error("No account detected");
    }
    const [listing, { getApprovalForTransaction }, { buyFromListing }] =
      await Promise.all([
        getListing({
          contract,
          listingId,
        }),
        import(
          "../../../../../../extensions/erc20/write/getApprovalForTransaction.js"
        ),
        import(
          "../../../../../../extensions/marketplace/direct-listings/write/buyFromListing.js"
        ),
      ]);
    if (!listing) {
      throw new Error(`Could not retrieve listing with ID: ${listingId}`);
    }

    let _quantity = 1n;
    // For ERC721 the quantity should always be 1n. We throw an error if user passes a different props
    if (listing.asset.type === "ERC721") {
      if (typeof quantity === "bigint" && (quantity !== 1n || quantity < 0n)) {
        throw new Error(
          "Invalid quantity. This is an ERC721 listing & quantity is always `1n`",
        );
      }
    } else if (listing.asset.type === "ERC1155") {
      if (typeof quantity === "bigint") {
        if (quantity > listing.quantity) {
          throw new Error(
            `quantity exceeds available amount. Available: ${listing.quantity.toString()}`,
          );
        }
        if (quantity < 0n) {
          throw new Error("Invalid quantity. Should be at least 1n");
        }
        _quantity = quantity;
      }
      _quantity = listing.quantity;
    }

    const buyTx = buyFromListing({
      contract,
      listingId,
      quantity: _quantity,
      recipient: account?.address || "",
    });

    const approveTx = await getApprovalForTransaction({
      account,
      transaction: buyTx,
    });

    if (approveTx) {
      await mutateAsync(approveTx);
    }

    return buyTx;
  }, [account, contract, quantity, listingId, mutateAsync]);

  return (
    <TransactionButton
      payModal={{
        metadata: defaultPayModalMetadata || payMetadata,
        ...payModal,
      }}
      transaction={() => prepareBuyTransaction()}
      {...props}
    >
      {children}
    </TransactionButton>
  );
}

/**
 * @internal
 */
async function getPayMetadata(
  options: BaseTransactionOptions<{ listingId: bigint }>,
): Promise<{ name?: string; image?: string }> {
  const listing = await getListing(options);
  if (!listing) {
    return { image: undefined, name: undefined };
  }
  return {
    image: listing.asset?.metadata?.image,
    name: listing.asset?.metadata?.name,
  };
}
