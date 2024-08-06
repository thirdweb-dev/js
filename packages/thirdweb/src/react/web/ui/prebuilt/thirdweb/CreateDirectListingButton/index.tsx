"use client";

import { useCallback } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { getContract } from "../../../../../../contract/contract.js";
import { getApprovalForTransaction } from "../../../../../../extensions/erc20/write/getApprovalForTransaction.js";
import {
  type CreateListingParams,
  createListing,
} from "../../../../../../extensions/marketplace/direct-listings/write/createListing.js";
import type { BaseTransactionOptions } from "../../../../../../transaction/types.js";
import { useReadContract } from "../../../../../core/hooks/contract/useReadContract.js";
import type { TransactionButtonProps } from "../../../../../core/hooks/transaction/transaction-button-utils.js";
import { useSendAndConfirmTransaction } from "../../../../../core/hooks/transaction/useSendAndConfirmTransaction.js";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { TransactionButton } from "../../../TransactionButton/index.js";

export type CreateDirectListingButtonProps = Omit<
  TransactionButtonProps,
  "transaction"
> &
  CreateListingParams & {
    contractAddress: string;
    chain: Chain;
    client: ThirdwebClient;
  };

/**
 * This button is used to create Direct listings for the thirdweb Marketplace v3 contract
 *
 * It uses the [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton)
 * and the [`createListing` extension](https://portal.thirdweb.com/references/typescript/v5/marketplace/createListing) under the hood
 * which means it inherits all the props of those 2 components.
 *
 * @example
 * ```tsx
 * import { CreateDirectListingButton } from "thirdweb/react";
 *
 * <CreateDirectListingButton
 *   contractAddress="0x..." // contract address for the marketplace-v3
 *   chain={...} // the chain which the marketplace contract is deployed on
 *
 *   // These props below are the same props for `createListing`
 *   // to get the full list, check the docs link above
 *   tokenId={0n}
 *   assetContractAddress="0x..." // The NFT contract address whose NFT(s) you want to sell
 *   pricePerToken={"0.1"} // sell for 0.1 <native token>
 * >
 *   Sell NFT
 * </CreateDirectListingButton>
 * ```
 *
 * For error handling & callbacks on transaction-sent and transaction-confirmed,
 * please refer to the TransactionButton docs.
 * @component
 */
export function CreateDirectListingButton(
  props: CreateDirectListingButtonProps,
) {
  const {
    contractAddress,
    chain,
    client,
    children,
    payModal,
    assetContractAddress,
    tokenId,
  } = props;
  const marketplaceContract = getContract({
    address: contractAddress,
    chain,
    client,
  });
  const account = useActiveAccount();
  const defaultPayModalMetadata = payModal ? payModal.metadata : undefined;
  const { data: payMetadata } = useReadContract(getPayMetadata, {
    contract: getContract({
      address: assetContractAddress,
      chain,
      client,
    }),
    tokenId,
    queryOptions: {
      enabled: !defaultPayModalMetadata,
    },
  });
  const { mutateAsync } = useSendAndConfirmTransaction();

  const prepareTransaction = useCallback(async () => {
    if (!account) {
      throw new Error("No account detected");
    }
    const listingTx = createListing({
      contract: marketplaceContract,
      ...props,
    });
    const approveTx = await getApprovalForTransaction({
      transaction: listingTx,
      account,
    });
    if (approveTx) {
      await mutateAsync(approveTx);
    }
    return listingTx;
  }, [marketplaceContract, props, account, mutateAsync]);

  return (
    <TransactionButton
      transaction={() => prepareTransaction()}
      payModal={{
        metadata: defaultPayModalMetadata || payMetadata,
        ...payModal,
      }}
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
  options: BaseTransactionOptions<{
    tokenId: bigint;
  }>,
): Promise<{ name?: string; image?: string }> {
  const [
    { isERC721 },
    { isERC1155 },
    { getContractMetadata },
    { getNFT: getERC721 },
    { getNFT: getERC1155 },
  ] = await Promise.all([
    import("../../../../../../extensions/erc721/read/isERC721.js"),
    import("../../../../../../extensions/erc1155/read/isERC1155.js"),
    import("../../../../../../extensions/common/read/getContractMetadata.js"),
    import("../../../../../../extensions/erc721/read/getNFT.js"),
    import("../../../../../../extensions/erc1155/read/getNFT.js"),
  ]);
  const [is721, is1155, contractMetadata] = await Promise.all([
    isERC721(options),
    isERC1155(options),
    getContractMetadata(options),
  ]);
  if (is721) {
    const nft = await getERC721(options);
    return {
      image: nft?.metadata?.image,
      name: nft?.metadata?.name,
    };
  }

  if (is1155) {
    const nft = await getERC1155(options);
    return {
      image: nft?.metadata?.image,
      name: nft?.metadata?.name,
    };
  }

  return {
    image: contractMetadata?.image,
    name: contractMetadata?.name,
  };
}
