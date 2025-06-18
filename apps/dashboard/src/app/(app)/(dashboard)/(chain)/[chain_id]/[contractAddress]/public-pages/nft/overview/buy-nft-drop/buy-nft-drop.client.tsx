"use client";
import { reportAssetBuy } from "@/analytics/report";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import type { NFT } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo, getNFT } from "thirdweb/extensions/erc721";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { getClaimParams } from "thirdweb/utils";
import { parseError } from "utils/errorParser";
import { getCurrencyMeta } from "../../../erc20/_utils/getCurrencyMeta";
import {
  type BuyNFTDropForm,
  BuyNFTDropUI,
  type BuyNFTDropUIProps,
} from "./buy-nft-drop-ui.client";

export type BuyNFTDropProps = Omit<
  BuyNFTDropUIProps,
  | "handleSubmit"
  | "getNFTDropClaimParams"
  | "getNFTsToClaim"
  | "activeAccountAddress"
>;

export function BuyNFTDrop(props: BuyNFTDropProps) {
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const account = useActiveAccount();

  function report(
    params:
      | {
          status: "attempted" | "successful";
        }
      | {
          status: "failed";
          errorMessage: string;
        },
  ) {
    reportAssetBuy({
      chainId: props.contract.chain.id,
      assetType: "NFT",
      contractType: "DropERC721",
      ...(params.status === "failed"
        ? {
            status: "failed",
            error: params.errorMessage,
          }
        : {
            status: "attempted",
          }),
    });
  }

  const handleSubmit = async (form: BuyNFTDropForm) => {
    const nftAmountToClaim = form.getValues("amount");
    try {
      if (!account) {
        return toast.error("No account detected");
      }

      report({
        status: "attempted",
      });

      const transaction = claimTo({
        contract: props.contract,
        to: account.address,
        quantity: BigInt(nftAmountToClaim),
        from: account.address,
      });

      const approveTx = await getApprovalForTransaction({
        transaction,
        account,
      });

      if (approveTx) {
        const approveTxPromise = sendAndConfirmTx.mutateAsync(approveTx, {
          onError: (error) => {
            console.error(error);
          },
        });

        toast.promise(approveTxPromise, {
          loading: "Requesting approval to spend ERC20 tokens for NFT purchase",
          success: "ERC20 token spending request approved successfully",
          error: (err) => ({
            message: "Approval to spend ERC20 tokens failed",
            description: parseError(err),
          }),
        });

        try {
          await approveTxPromise;
        } catch (err) {
          console.error(err);
          const errorMessage = parseError(err);

          report({
            status: "failed",
            errorMessage,
          });

          return;
        }
      }

      const claimTxPromise = sendAndConfirmTx.mutateAsync(transaction);

      const nftOrNfts = nftAmountToClaim > 1 ? "NFTs" : "NFT";

      toast.promise(claimTxPromise, {
        loading: `Buying ${nftAmountToClaim} ${nftOrNfts}`,
        success: `${nftOrNfts} bought successfully`,
        error: (err) => ({
          message: `Failed to buy ${nftAmountToClaim} ${nftOrNfts}`,
          description: parseError(err),
        }),
      });

      try {
        await claimTxPromise;

        report({
          status: "successful",
        });

        props.onSuccess?.();
      } catch (err) {
        console.error(err);
        const errorMessage = parseError(err);

        report({
          status: "failed",
          errorMessage,
        });

        return;
      }
    } catch (err) {
      console.error(err);
      const errorMessage = parseError(err);

      toast.error("Failed to buy NFTs", {
        description: errorMessage,
      });
      report({
        status: "failed",
        errorMessage,
      });
    }
  };

  return (
    <BuyNFTDropUI
      contract={props.contract}
      activeAccountAddress={account?.address}
      chainMetadata={props.chainMetadata}
      claimCondition={props.claimCondition}
      totalNFTs={props.totalNFTs}
      nextTokenIdToClaim={props.nextTokenIdToClaim}
      totalUnclaimedSupply={props.totalUnclaimedSupply}
      getNFTDropClaimParams={getNFTDropClaimParams}
      getNFTsToClaim={getNFTsToClaim}
      handleSubmit={handleSubmit}
    />
  );
}

async function getNFTDropClaimParams(params: {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  accountAddress: string;
}) {
  const claimParams = await getClaimParams({
    type: "erc721",
    contract: params.contract,
    quantity: BigInt(1),
    to: params.accountAddress,
    from: params.accountAddress,
  });

  const meta = await getCurrencyMeta({
    currencyAddress: claimParams.currency,
    chainMetadata: params.chainMetadata,
    chain: params.contract.chain,
    client: params.contract.client,
  });

  return {
    pricePerTokenWei: claimParams.pricePerToken,
    currencyAddress: claimParams.currency,
    decimals: meta.decimals,
    symbol: meta.symbol,
  };
}

async function getNFTsToClaim(params: {
  contract: ThirdwebContract;
  nextTokenIdToClaim: bigint;
  count: number;
}) {
  const nftPromises: Promise<NFT>[] = [];
  for (let i = 0; i < params.count; i++) {
    const nftPromise = getNFT({
      contract: params.contract,
      tokenId: params.nextTokenIdToClaim + BigInt(i),
      includeOwner: true,
      tokenByIndex: true,
    });
    nftPromises.push(nftPromise);
  }

  return Promise.all(nftPromises);
}

export type GetNFTDropClaimParams = typeof getNFTDropClaimParams;
export type GetNFTsToClaim = typeof getNFTsToClaim;
