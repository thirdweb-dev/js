"use client";

import { useCallback } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { getContract } from "../../../../../../contract/contract.js";
import { stakingToken } from "../../../../../../extensions/erc721/__generated__/IStaking721/read/stakingToken.js";
import type { TransactionButtonProps } from "../../../../../core/hooks/transaction/transaction-button-utils.js";
import { useSendAndConfirmTransaction } from "../../../../../core/hooks/transaction/useSendAndConfirmTransaction.js";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { TransactionButton } from "../../../TransactionButton/index.js";

export type StakeERC721ButtonProps = Omit<
  TransactionButtonProps,
  "transaction"
> & {
  contractAddress: string;
  tokenIds: bigint[];
  chain: Chain;
  client: ThirdwebClient;
};

/**
 * This button is used for staking ERC721 tokens into a [thirdweb StakeERC721 contract](https://thirdweb.com/thirdweb.eth/NFTStake)
 *
 * Users only need to pass the tokenIds and _not_ the NFT contract address, since each StakeERC721 contract only
 * supports 1 NFT asset, and the NFT address can be accessed by calling the "stakingToken" method.
 *
 * This button uses the [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton)
 * which means it inherits all the props of that component.
 *
 * @example
 * ```tsx
 * import { StakeERC721Button } from "thirdweb/react";
 *
 * <StakeERC721Button
 *   contractAddress="0x..." // the StakeERC721 contract address
 *   chain={...} // the chain which the stake contract is deployed on
 *   client={...} // thirdweb Client
 *   tokenIds={[0n, 1n, 2n, ...]} // the IDs of the NFTs you want to stake
 * >
 *   Stake NFT
 * </StakeERC721Button>
 * ```
 *
 * @component
 */
export function StakeERC721Button(props: StakeERC721ButtonProps) {
  const { children, contractAddress, chain, client, tokenIds } = props;
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
      stakingToken({ contract: stakeContract }),
      import(
        "../../../../../../extensions/erc721/__generated__/IERC721A/read/isApprovedForAll.js"
      ),
      import(
        "../../../../../../extensions/erc721/__generated__/IERC721A/write/setApprovalForAll.js"
      ),
      import(
        "../../../../../../extensions/erc721/__generated__/IStaking721/write/stake.js"
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
    return stake({ contract: stakeContract, tokenIds });
  }, [
    account,
    stakeContract,
    chain,
    client,
    tokenIds,
    contractAddress,
    mutateAsync,
  ]);

  return (
    <TransactionButton transaction={() => prepareTransaction()} {...props}>
      {children}
    </TransactionButton>
  );
}
