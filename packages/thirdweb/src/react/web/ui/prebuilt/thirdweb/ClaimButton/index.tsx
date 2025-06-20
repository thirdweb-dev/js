"use client";

import {
  getContract,
  type ThirdwebContract,
} from "../../../../../../contract/contract.js";
import { getContractMetadata } from "../../../../../../extensions/common/read/getContractMetadata.js";
import { getNFT } from "../../../../../../extensions/erc1155/read/getNFT.js";
import type { PreparedTransaction } from "../../../../../../transaction/prepare-transaction.js";
import type { BaseTransactionOptions } from "../../../../../../transaction/types.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { useReadContract } from "../../../../../core/hooks/contract/useReadContract.js";
import { useSendAndConfirmTransaction } from "../../../../../core/hooks/transaction/useSendAndConfirmTransaction.js";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { TransactionButton } from "../../../TransactionButton/index.js";
import type {
  ClaimButtonProps,
  ClaimParams,
  Erc20ClaimParams,
  Erc721ClaimParams,
  Erc1155ClaimParams,
} from "./types.js";

/**
 * This button is used to claim tokens (NFT or ERC20) from a given thirdweb Drop contract.
 *
 * there are 3 type of Drop contract: NFT Drop (DropERC721), Edition Drop (DropERC1155) and Token Drop (DropERC20)
 *
 * Learn more: https://thirdweb.com/explore/drops
 *
 *
 * Note: This button only works with thirdweb Drop contracts.
 * For custom contract, please use [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton)
 * @param props
 * @returns A wrapper for TransactionButton
 *
 * @component
 * @example
 *
 * Example for claiming NFT from an NFT Drop contract
 * ```tsx
 * import { ClaimButton } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * <ClaimButton
 *   contractAddress="0x..." // contract address of the NFT Drop
 *   chain={ethereum}
 *   client={client}
 *   claimParams={{
 *     type: "ERC721",
 *     quantity: 1n, // claim 1 token
 *   }}
 * >
 *   Claim now
 * </ClaimButton>
 * ```
 *
 * For Edition Drop (ERC1155)
 * ```tsx
 * <ClaimButton
 *   contractAddress="0x..." // contract address of the Edition Drop
 *   chain={ethereum}
 *   client={client}
 *   claimParams={{
 *     type: "ERC1155",
 *     quantity: 1n,
 *     tokenId: 0n,
 *   }}
 * >
 *   Claim now
 * </ClaimButton>
 * ```
 *
 * For Token Drop (ERC20)
 * ```tsx
 * <ClaimButton
 *   contractAddress="0x..." // contract address of the Token Drop
 *   chain={ethereum}
 *   client={client}
 *   claimParams={{
 *     type: "ERC20",
 *     quantity: "100", // claim 100 ERC20 tokens
 *     // instead of `quantity`, you can also use `quantityInWei` (bigint)
 *   }}
 * >
 *   Claim now
 * </ClaimButton>
 * ```
 *
 * Attach custom Pay metadata
 * ```tsx
 * <ClaimButton
 *   payModal={{
 *     metadata: {
 *       name: "Van Gogh Starry Night",
 *       image: "https://unsplash.com/starry-night.png"
 *     }
 *   }}
 * >...</ClaimButton>
 *
 * ```
 *
 * Since this button uses the `TransactionButton`, it can take in any props that can be passed
 * to the [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton)
 *
 *
 * For error handling & callbacks on transaction-sent and transaction-confirmed,
 * please refer to the TransactionButton docs.
 * @transaction
 */
export function ClaimButton(props: ClaimButtonProps) {
  const { children, contractAddress, client, chain, claimParams, payModal } =
    props;
  const defaultPayModalMetadata = payModal ? payModal.metadata : undefined;
  const contract = getContract({
    address: contractAddress,
    chain,
    client,
  });

  const { data: payMetadata } = useReadContract(getPayMetadata, {
    contract,
    queryOptions: {
      enabled: !defaultPayModalMetadata,
    },
    tokenId: claimParams.type === "ERC1155" ? claimParams.tokenId : undefined,
  });
  const account = useActiveAccount();
  const { mutateAsync } = useSendAndConfirmTransaction();
  return (
    <TransactionButton
      payModal={{
        metadata: defaultPayModalMetadata || payMetadata,
        ...payModal,
      }}
      transaction={async () => {
        if (!account) {
          throw new Error("No account detected");
        }
        const [claimTx, { getApprovalForTransaction }] = await Promise.all([
          getClaimTransaction({
            account,
            claimParams,
            contract,
          }),
          import(
            "../../../../../../extensions/erc20/write/getApprovalForTransaction.js"
          ),
        ]);
        const approveTx = await getApprovalForTransaction({
          account,
          transaction: claimTx,
        });
        if (approveTx) {
          await mutateAsync(approveTx);
        }
        return claimTx;
      }}
      {...props}
    >
      {children}
    </TransactionButton>
  );
}

/**
 * We can only get the image and name for Edition Drop
 * For NFT Drop and Token Drop we fall back to the name & image of the contract
 * @internal
 */
async function getPayMetadata(
  options: BaseTransactionOptions<{ tokenId?: bigint }>,
): Promise<{ name?: string; image?: string }> {
  const { contract, tokenId } = options;
  const [contractMetadata, nft] = await Promise.all([
    getContractMetadata(options),
    tokenId ? getNFT({ contract, tokenId }) : undefined,
  ]);
  if (tokenId) {
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

/**
 * @internal Export for test
 */
async function getClaimTransaction({
  contract,
  account,
  claimParams,
}: {
  contract: ThirdwebContract;
  account: Account | undefined;
  claimParams: ClaimParams;
}): Promise<PreparedTransaction> {
  switch (claimParams.type) {
    case "ERC721":
      return await getERC721ClaimTo({ account, claimParams, contract });
    case "ERC1155":
      return await getERC1155ClaimTo({ account, claimParams, contract });
    case "ERC20": {
      return await getERC20ClaimTo({ account, claimParams, contract });
    }
    default:
      throw new Error(
        "Invalid contract type. Must be either NFT Drop (ERC721), Edition Drop (ERC1155) or Token Drop (ERC20)",
      );
  }
}

/**
 * @internal
 */
export async function getERC721ClaimTo({
  contract,
  account,
  claimParams,
}: {
  contract: ThirdwebContract;
  account: Account | undefined;
  claimParams: Erc721ClaimParams;
}) {
  const { claimTo } = await import(
    "../../../../../../extensions/erc721/drops/write/claimTo.js"
  );

  return claimTo({
    contract,
    from: claimParams.from,
    quantity: claimParams.quantity,
    to: claimParams.to || account?.address || "",
  });
}

/**
 * @internal
 */
export async function getERC1155ClaimTo({
  contract,
  account,
  claimParams,
}: {
  contract: ThirdwebContract;
  account: Account | undefined;
  claimParams: Erc1155ClaimParams;
}) {
  const { claimTo } = await import(
    "../../../../../../extensions/erc1155/drops/write/claimTo.js"
  );

  return claimTo({
    contract,
    from: claimParams.from,
    quantity: claimParams.quantity,
    to: claimParams.to || account?.address || "",
    tokenId: claimParams.tokenId,
  });
}

/**
 * @internal
 */
export async function getERC20ClaimTo({
  contract,
  account,
  claimParams,
}: {
  contract: ThirdwebContract;
  account: Account | undefined;
  claimParams: Erc20ClaimParams;
}) {
  // Ideally we should check if the contract is ERC20 using `isERC20`
  // however TokenDrop doesn't have `supportsInterface` so it doesn't work
  const { claimTo } = await import(
    "../../../../../../extensions/erc20/drops/write/claimTo.js"
  );

  if ("quantity" in claimParams) {
    return claimTo({
      contract,
      from: claimParams.from,
      quantity: claimParams.quantity,
      to: claimParams.to || account?.address || "",
    });
  }
  if ("quantityInWei" in claimParams) {
    return claimTo({
      contract,
      from: claimParams.from,
      quantityInWei: claimParams.quantityInWei,
      to: claimParams.to || account?.address || "",
    });
  }
  throw new Error("Missing quantity or quantityInWei");
}
