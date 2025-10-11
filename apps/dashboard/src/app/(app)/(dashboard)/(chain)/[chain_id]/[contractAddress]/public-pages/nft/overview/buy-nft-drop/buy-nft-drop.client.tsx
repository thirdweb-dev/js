"use client";
import { toast } from "sonner";
import type { NFT, ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo, getNFT } from "thirdweb/extensions/erc721";
import { useActiveAccount } from "thirdweb/react";
import { getClaimParams } from "thirdweb/utils";
import {
  reportAssetBuyFailed,
  reportAssetBuySuccessful,
} from "@/analytics/report";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { parseError } from "@/utils/errorParser";
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
  const sendAndConfirmTx = useSendAndConfirmTx();
  const account = useActiveAccount();

  const handleSubmit = async (form: BuyNFTDropForm) => {
    const nftAmountToClaim = form.getValues("amount");
    try {
      if (!account) {
        return toast.error("No account detected");
      }

      const transaction = claimTo({
        contract: props.contract,
        from: account.address,
        quantity: BigInt(nftAmountToClaim),
        to: account.address,
      });

      const approveTx = await getApprovalForTransaction({
        account,
        transaction,
      });

      if (approveTx) {
        const approveTxPromise = sendAndConfirmTx.mutateAsync(approveTx, {
          onError: (error) => {
            console.error(error);
          },
        });

        toast.promise(approveTxPromise, {
          error: (err) => ({
            description: parseError(err),
            message: "Approval to spend ERC20 tokens failed",
          }),
          loading: "Requesting approval to spend ERC20 tokens for NFT purchase",
          success: "ERC20 token spending request approved successfully",
        });

        try {
          await approveTxPromise;
        } catch (err) {
          console.error(err);
          const errorMessage = parseError(err);

          reportAssetBuyFailed({
            assetType: "nft",
            chainId: props.contract.chain.id,
            contractType: "DropERC721",
            error: errorMessage,
            is_testnet: props.chainMetadata.testnet,
          });

          return;
        }
      }

      const claimTxPromise = sendAndConfirmTx.mutateAsync(transaction);

      const nftOrNfts = nftAmountToClaim > 1 ? "NFTs" : "NFT";

      toast.promise(claimTxPromise, {
        error: (err) => ({
          description: parseError(err),
          message: `Failed to buy ${nftAmountToClaim} ${nftOrNfts}`,
        }),
        loading: `Buying ${nftAmountToClaim} ${nftOrNfts}`,
        success: `${nftOrNfts} bought successfully`,
      });

      try {
        await claimTxPromise;

        reportAssetBuySuccessful({
          assetType: "nft",
          chainId: props.contract.chain.id,
          contractType: "DropERC721",
          is_testnet: props.chainMetadata.testnet,
        });

        props.onSuccess?.();
      } catch (err) {
        console.error(err);
        const errorMessage = parseError(err);

        reportAssetBuyFailed({
          assetType: "nft",
          chainId: props.contract.chain.id,
          contractType: "DropERC721",
          error: errorMessage,
          is_testnet: props.chainMetadata.testnet,
        });

        return;
      }
    } catch (err) {
      console.error(err);
      const errorMessage = parseError(err);

      toast.error("Failed to buy NFTs", {
        description: errorMessage,
      });
      reportAssetBuyFailed({
        assetType: "nft",
        chainId: props.contract.chain.id,
        contractType: "DropERC721",
        error: errorMessage,
        is_testnet: props.chainMetadata.testnet,
      });
    }
  };

  return (
    <BuyNFTDropUI
      activeAccountAddress={account?.address}
      chainMetadata={props.chainMetadata}
      claimCondition={props.claimCondition}
      contract={props.contract}
      getNFTDropClaimParams={getNFTDropClaimParams}
      getNFTsToClaim={getNFTsToClaim}
      handleSubmit={handleSubmit}
      nextTokenIdToClaim={props.nextTokenIdToClaim}
      totalNFTs={props.totalNFTs}
      totalUnclaimedSupply={props.totalUnclaimedSupply}
    />
  );
}

async function getNFTDropClaimParams(params: {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  accountAddress: string;
}) {
  const claimParams = await getClaimParams({
    contract: params.contract,
    from: params.accountAddress,
    quantity: BigInt(1),
    to: params.accountAddress,
    type: "erc721",
  });

  const meta = await getCurrencyMeta({
    chain: params.contract.chain,
    chainMetadata: params.chainMetadata,
    client: params.contract.client,
    currencyAddress: claimParams.currency,
  });

  return {
    currencyAddress: claimParams.currency,
    decimals: meta.decimals,
    pricePerTokenWei: claimParams.pricePerToken,
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
      includeOwner: true,
      tokenByIndex: true,
      tokenId: params.nextTokenIdToClaim + BigInt(i),
    });
    nftPromises.push(nftPromise);
  }

  return Promise.all(nftPromises);
}

export type GetNFTDropClaimParams = typeof getNFTDropClaimParams;
export type GetNFTsToClaim = typeof getNFTsToClaim;
