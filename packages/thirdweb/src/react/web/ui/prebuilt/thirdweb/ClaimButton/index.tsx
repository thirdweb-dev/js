"use client";

import {
  type ThirdwebContract,
  getContract,
} from "../../../../../../contract/contract.js";
import type { PreparedTransaction } from "../../../../../../transaction/prepare-transaction.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { useActiveAccount } from "../../../../hooks/wallets/useActiveAccount.js";
import { TransactionButton } from "../../../TransactionButton/index.js";
import type {
  ClaimButtonProps,
  ClaimParams,
  Erc20ClaimParams,
  Erc721ClaimParams,
  Erc1155ClaimParams,
} from "./types.js";

/**
 * This button is used to claim tokens (NFT or ERC20) from a given thirdweb Drop contract
 *
 * there are 3 type of Drop contract: NFT Drop (DropERC721), Edition Drop (DropERC1155) and Token Drop (DropERC20)
 *
 * Learn more: https://thirdweb.com/explore/drops
 *
 * Note: This button only works with thirdweb Drop contracts.
 * For custom contract, please use [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton)
 * @param props
 * @returns A wrapper for TransactionButton
 *
 * @example
 *
 * ```tsx
 * import { ClaimButton } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * // For NFT Drop (ERC721)
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
 *
 *
 * // For Edition Drop (ERC1155)
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
 *
 *
 * // For Token Drop (ERC20)
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
 *
 * ```
 */
export function ClaimButton(props: ClaimButtonProps) {
  const { children, contractAddress, client, chain, claimParams } = props;
  const contract = getContract({
    address: contractAddress,
    client,
    chain,
  });
  const account = useActiveAccount();
  // TODO (pay): fetch nft metadata and set it as the payOptions metadata
  return (
    <TransactionButton
      transaction={async () =>
        await getClaimTransaction({ contract, account, claimParams })
      }
      {...props}
    >
      {children}
    </TransactionButton>
  );
}

/**
 * @internal Export for test
 */
export async function getClaimTransaction({
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
      return await getERC721ClaimTo({ contract, account, claimParams });
    case "ERC1155":
      return await getERC1155ClaimTo({ contract, account, claimParams });
    case "ERC20": {
      return await getERC20ClaimTo({ contract, account, claimParams });
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
  const [{ isERC721 }, { isClaimSupported }, { claimTo }] = await Promise.all([
    import("../../../../../../extensions/erc721/read/isERC721.js"),
    import(
      "../../../../../../extensions/erc721/__generated__/IDrop/write/claim.js"
    ),
    import("../../../../../../extensions/erc721/drops/write/claimTo.js"),
  ]);
  const [is721, claimSupported] = await Promise.all([
    isERC721({ contract }).catch(() => false),
    isClaimSupported(contract).catch(() => false),
  ]);
  if (!is721) {
    throw new Error("Not an ERC721 contract");
  }
  if (!claimSupported) {
    throw new Error("Not a valid NFT Drop (ERC721) contract");
  }
  return claimTo({
    contract,
    to: account?.address || "",
    quantity: claimParams.quantity,
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
  const [{ isERC1155 }, { isClaimSupported }, { claimTo }] = await Promise.all([
    import("../../../../../../extensions/erc1155/read/isERC1155.js"),
    import(
      "../../../../../../extensions/erc1155/__generated__/IDrop1155/write/claim.js"
    ),
    import("../../../../../../extensions/erc1155/drops/write/claimTo.js"),
  ]);
  const [is1155, claimSupported] = await Promise.all([
    isERC1155({ contract }).catch(() => false),
    isClaimSupported(contract).catch(() => false),
  ]);
  if (!is1155) {
    throw new Error("Not a valid ERC1155 contract");
  }
  if (!claimSupported) {
    throw new Error("Not a valid thirdweb Edition Drop contract");
  }
  return claimTo({
    contract,
    to: account?.address || "",
    quantity: claimParams.quantity,
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
  const [{ isClaimSupported }, { claimTo }] = await Promise.all([
    import(
      "../../../../../../extensions/erc20/__generated__/IDropERC20/write/claim.js"
    ),
    import("../../../../../../extensions/erc20/drops/write/claimTo.js"),
  ]);
  const claimSupported = await isClaimSupported(contract).catch(() => false);
  if (!claimSupported) {
    throw new Error("Not a valid thirdweb Token Drop contract");
  }
  if ("quantity" in claimParams) {
    return claimTo({
      contract,
      to: account?.address || "",
      quantity: claimParams.quantity,
    });
  }
  if ("quantityInWei" in claimParams) {
    return claimTo({
      contract,
      to: account?.address || "",
      quantityInWei: claimParams.quantityInWei,
    });
  }
  throw new Error("Missing quantity or quantityInWei");
}
