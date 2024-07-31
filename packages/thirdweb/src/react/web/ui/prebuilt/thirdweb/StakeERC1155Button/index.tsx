"use client";

import { useCallback } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { getContract } from "../../../../../../contract/contract.js";
import { stakingToken } from "../../../../../../extensions/erc1155/__generated__/IStaking1155/read/stakingToken.js";
import type { StakeParams } from "../../../../../../extensions/erc1155/__generated__/IStaking1155/write/stake.js";
import type { TransactionButtonProps } from "../../../../../core/hooks/transaction/transaction-button-utils.js";
import { useSendAndConfirmTransaction } from "../../../../../core/hooks/transaction/useSendAndConfirmTransaction.js";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { TransactionButton } from "../../../TransactionButton/index.js";

export type StakeERC1155ButtonProps = Omit<
  TransactionButtonProps,
  "transaction"
> & {
  contractAddress: string;
  chain: Chain;
  client: ThirdwebClient;
} & StakeParams;

/**
 * This button is used for staking ERC1155 tokens into a [thirdweb StakeERC1155 contract](https://thirdweb.com/thirdweb.eth/EditionStake)
 *
 * Users only need to pass the tokenIds and _not_ the NFT contract address, since each StakeERC1155 contract only
 * supports 1 NFT asset, and the NFT address can be accessed by calling the "stakingToken" method.
 *
 * This button uses the [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton)
 * which means it inherits all the props of that component.
 *
 * @example
 * ```tsx
 * import { StakeERC1155Button } from "thirdweb/react";
 *
 * <StakeERC1155Button
 *   contractAddress="0x..." // the StakeERC1155 contract address
 *   chain={...} // the chain which the stake contract is deployed on
 *   client={...} // thirdweb Client
 *   tokenId={0n} // the ID of the NFT (Edition) you want to stake
 *   amount={100n} // amount to stake
 * >
 *   Stake NFT
 * </StakeERC1155Button>
 * ```
 *
 * @component
 */
export function StakeERC1155Button(props: StakeERC1155ButtonProps) {
  const { children, contractAddress, chain, client, tokenId, amount } = props;
  const account = useActiveAccount();
  const stakeContract = getContract({
    address: contractAddress,
    chain,
    client,
  });
  const { mutateAsync } = useSendAndConfirmTransaction();

  const prepareTransaction = useCallback(async () => {
    if (!account) {
      throw new Error("No account detected");
    }
    const [
      nftContractAddress,
      { isApprovedForAll },
      { setApprovalForAll },
      { stake },
    ] = await Promise.all([
      stakingToken({ contract: stakeContract }).catch(() => ""),
      import(
        "../../../../../../extensions/erc1155/__generated__/IERC1155/read/isApprovedForAll.js"
      ),
      import(
        "../../../../../../extensions/erc1155/__generated__/IERC1155/write/setApprovalForAll.js"
      ),
      import(
        "../../../../../../extensions/erc1155/__generated__/IStaking1155/write/stake.js"
      ),
    ]);
    if (!nftContractAddress) {
      throw new Error("Could not fetch staking token");
    }
    const nftContract = getContract({
      address: nftContractAddress,
      chain,
      client,
    });
    // Check for approval
    const isApproved = await isApprovedForAll({
      contract: nftContract,
      operator: contractAddress,
      owner: account.address,
    });
    if (!isApproved) {
      const approveTx = setApprovalForAll({
        contract: nftContract,
        operator: contractAddress,
        approved: true,
      });
      await mutateAsync(approveTx);
    }
    return stake({ contract: stakeContract, tokenId, amount });
  }, [
    account,
    stakeContract,
    chain,
    client,
    tokenId,
    amount,
    contractAddress,
    mutateAsync,
  ]);

  return (
    <TransactionButton transaction={() => prepareTransaction()} {...props}>
      {children}
    </TransactionButton>
  );
}
