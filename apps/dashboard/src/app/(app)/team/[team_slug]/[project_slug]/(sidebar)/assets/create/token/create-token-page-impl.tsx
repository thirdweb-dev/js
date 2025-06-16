"use client";
import { revalidatePathAction } from "@/actions/revalidate";
import {} from "constants/addresses";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { defineDashboardChain } from "lib/defineDashboardChain";
import { useRef } from "react";
import { toast } from "sonner";
import {
  type ThirdwebClient,
  defineChain,
  getContract,
  sendAndConfirmTransaction,
  toWei,
} from "thirdweb";
import {
  createToken,
  distributeToken,
  getDeployedEntrypointERC20,
} from "thirdweb/assets";
import { approve } from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { parseError } from "utils/errorParser";
import { useAddContractToProject } from "../../../hooks/project-contracts";
import type { CreateAssetFormValues } from "./_common/form";
import {
  getTokenDeploymentTrackingData,
  getTokenStepTrackingData,
} from "./_common/tracking";
import { CreateTokenAssetPageUI } from "./create-token-page.client";

export function CreateTokenAssetPage(props: {
  accountAddress: string;
  client: ThirdwebClient;
  teamId: string;
  projectId: string;
  teamSlug: string;
  projectSlug: string;
}) {
  const account = useActiveAccount();
  const { idToChain } = useAllChainsData();
  const addContractToProject = useAddContractToProject();
  const contractAddressRef = useRef<string | undefined>(undefined);
  const trackEvent = useTrack();

  async function deployContract(formValues: CreateAssetFormValues) {
    if (!account) {
      toast.error("No Connected Wallet");
      throw new Error("No Connected Wallet");
    }

    trackEvent(
      getTokenStepTrackingData({
        action: "deploy",
        chainId: Number(formValues.chain),
        status: "attempt",
      }),
    );

    trackEvent(
      getTokenDeploymentTrackingData({
        type: "attempt",
        chainId: Number(formValues.chain),
      }),
    );

    const socialUrls = formValues.socialUrls.reduce(
      (acc, url) => {
        if (url.url && url.platform) {
          acc[url.platform] = url.url;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    try {
      const salePercent = Number(formValues.saleAllocationPercentage);
      const saleAmount = Number(formValues.supply) * (salePercent / 100);

      const contractAddress = await createToken({
        client: props.client,
        // eslint-disable-next-line no-restricted-syntax
        chain: defineChain(Number(formValues.chain)),
        account,
        params: {
          maxSupply: BigInt(formValues.supply),
          name: formValues.name,
          description: formValues.description,
          symbol: formValues.symbol,
          image: formValues.image,
          social_urls: socialUrls,
        },
        launchConfig:
          formValues.saleMode === "public-market" && saleAmount !== 0
            ? {
                kind: "pool", // public
                config: {
                  amount: BigInt(saleAmount),
                  fee: Number(formValues.publicMarket.tradingFees) * 10000, // TODO - fix in SDK
                  // initialTick (floorPrice) : disabled for now
                },
              }
            : undefined,
      });

      trackEvent(
        getTokenStepTrackingData({
          action: "deploy",
          chainId: Number(formValues.chain),
          status: "success",
        }),
      );

      trackEvent(
        getTokenDeploymentTrackingData({
          type: "success",
          chainId: Number(formValues.chain),
        }),
      );

      // add contract to project in background
      addContractToProject.mutateAsync({
        teamId: props.teamId,
        projectId: props.projectId,
        contractAddress: contractAddress,
        chainId: formValues.chain,
        deploymentType: "asset",
        contractType: "ERC20Asset",
      });

      contractAddressRef.current = contractAddress;

      return {
        contractAddress: contractAddress,
      };
    } catch (e) {
      const parsedError = parseError(e);
      const errorMessage =
        typeof parsedError === "string" ? parsedError : "Unknown error";
      trackEvent(
        getTokenStepTrackingData({
          action: "deploy",
          chainId: Number(formValues.chain),
          status: "error",
          errorMessage,
        }),
      );

      trackEvent(
        getTokenDeploymentTrackingData({
          type: "error",
          chainId: Number(formValues.chain),
          errorMessage,
        }),
      );
      throw e;
    }
  }

  async function airdropTokens(formValues: CreateAssetFormValues) {
    const contractAddress = contractAddressRef.current;

    if (!contractAddress) {
      throw new Error("No contract address");
    }

    if (!account) {
      throw new Error("No connected account");
    }

    // eslint-disable-next-line no-restricted-syntax
    const chain = defineDashboardChain(
      Number(formValues.chain),
      idToChain.get(Number(formValues.chain)),
    );

    const tokenContract = getContract({
      address: contractAddress,
      client: props.client,
      chain,
    });

    trackEvent(
      getTokenStepTrackingData({
        action: "airdrop",
        chainId: Number(formValues.chain),
        status: "attempt",
      }),
    );

    const totalAmountToAirdrop = formValues.airdropAddresses.reduce(
      (acc, recipient) => acc + BigInt(recipient.quantity),
      0n,
    );

    // approve entrypoint to spend tokens

    try {
      const entrypoint = await getDeployedEntrypointERC20({
        chain,
        client: props.client,
      });

      if (!entrypoint) {
        throw new Error("Entrypoint not found");
      }

      const approvalTx = approve({
        contract: tokenContract,
        spender: entrypoint.address,
        amountWei: toWei(totalAmountToAirdrop.toString()),
      });

      await sendAndConfirmTransaction({
        transaction: approvalTx,
        account,
      });
    } catch (e) {
      trackEvent(
        getTokenStepTrackingData({
          action: "airdrop",
          chainId: Number(formValues.chain),
          status: "error",
          errorMessage: e instanceof Error ? e.message : "Unknown error",
        }),
      );
      throw e;
    }

    try {
      const airdropTx = await distributeToken({
        client: props.client,
        // eslint-disable-next-line no-restricted-syntax
        chain,
        tokenAddress: contractAddress,
        contents: formValues.airdropAddresses.map((recipient) => ({
          amount: BigInt(recipient.quantity),
          recipient: recipient.address,
        })),
      });

      await sendAndConfirmTransaction({
        transaction: airdropTx,
        account,
      });

      trackEvent(
        getTokenStepTrackingData({
          action: "airdrop",
          chainId: Number(formValues.chain),
          status: "success",
        }),
      );
    } catch (e) {
      trackEvent(
        getTokenStepTrackingData({
          action: "airdrop",
          chainId: Number(formValues.chain),
          status: "error",
          errorMessage: e instanceof Error ? e.message : "Unknown error",
        }),
      );
      throw e;
    }
  }

  return (
    <CreateTokenAssetPageUI
      accountAddress={props.accountAddress}
      client={props.client}
      teamSlug={props.teamSlug}
      projectSlug={props.projectSlug}
      onLaunchSuccess={() => {
        revalidatePathAction(
          `/team/${props.teamSlug}/project/${props.projectId}/assets`,
          "page",
        );
      }}
      createTokenFunctions={{
        deployContract,
        airdropTokens,
      }}
    />
  );
}
