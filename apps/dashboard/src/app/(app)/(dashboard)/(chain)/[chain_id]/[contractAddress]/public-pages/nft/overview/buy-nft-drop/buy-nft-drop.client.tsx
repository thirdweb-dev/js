"use client";
import { useTrack } from "hooks/analytics/useTrack";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import type { NFT } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo, getNFT } from "thirdweb/extensions/erc721";
import {
  useActiveAccount,
  useActiveWallet,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
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
  const trackEvent = useTrack();
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();

  function trackAssetBuy(
    params:
      | {
          type: "attempt" | "success";
        }
      | {
          type: "error";
          errorMessage: string;
        },
  ) {
    trackEvent({
      category: "asset",
      action: "buy",
      label: params.type,
      contractType: "NFTCollection",
      ercType: "erc721",
      accountAddress: account?.address,
      walletId: activeWallet?.id,
      chainId: props.contract.chain.id,
      ...(params.type === "error"
        ? {
            errorMessage: params.errorMessage,
          }
        : {}),
    });
  }

  const handleSubmit = async (form: BuyNFTDropForm) => {
    const nftAmountToClaim = form.getValues("amount");
    try {
      trackAssetBuy({
        type: "attempt",
      });

      if (!account) {
        return toast.error("No account detected");
      }

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
          const errorMessage = parseError(err);
          trackAssetBuy({
            type: "error",
            errorMessage:
              typeof errorMessage === "string" ? errorMessage : "Unknown error",
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

        trackAssetBuy({
          type: "success",
        });

        props.onSuccess?.();
      } catch (err) {
        const errorMessage = parseError(err);
        trackAssetBuy({
          type: "error",
          errorMessage:
            typeof errorMessage === "string" ? errorMessage : "Unknown error",
        });
        return;
      }
    } catch (err) {
      const errorMessage = parseError(err);
      toast.error("Failed to buy NFTs", {
        description:
          typeof errorMessage === "string" ? errorMessage : undefined,
      });
      trackAssetBuy({
        type: "error",
        errorMessage:
          typeof errorMessage === "string" ? errorMessage : "Unknown error",
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
