"use client";
import { useRef } from "react";
import { toast } from "sonner";
import {
  defineChain,
  getContract,
  sendAndConfirmTransaction,
  type ThirdwebClient,
  toWei,
} from "thirdweb";
import {
  createToken,
  distributeToken,
  getDeployedEntrypointERC20,
} from "thirdweb/assets";
import { approve } from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { revalidatePathAction } from "@/actions/revalidate";
import {
  reportAssetCreationFailed,
  reportContractDeployed,
} from "@/analytics/report";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useAddContractToProject } from "@/hooks/project-contracts";
import { defineDashboardChain } from "@/lib/defineDashboardChain";
import { parseError } from "@/utils/errorParser";
import { createTokenOnUniversalBridge } from "../_apis/create-token-on-bridge";
import type { CreateAssetFormValues } from "./_common/form";
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

  async function deployContract(formValues: CreateAssetFormValues) {
    if (!account) {
      toast.error("No Connected Wallet");
      throw new Error("No Connected Wallet");
    }

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
        account,
        // eslint-disable-next-line no-restricted-syntax
        chain: defineChain(Number(formValues.chain)),
        client: props.client,
        launchConfig:
          formValues.saleMode === "public-market" && saleAmount !== 0
            ? {
                config: {
                  amount: BigInt(saleAmount),
                  fee: Number(formValues.publicMarket.tradingFees) * 10000, // TODO - fix in SDK
                  // initialTick (floorPrice) : disabled for now
                }, // public
                kind: "pool",
              }
            : undefined,
        params: {
          description: formValues.description,
          image: formValues.image,
          maxSupply: BigInt(formValues.supply),
          name: formValues.name,
          social_urls: socialUrls,
          symbol: formValues.symbol,
        },
      });

      // add contract to project in background
      addContractToProject.mutateAsync({
        chainId: formValues.chain,
        contractAddress: contractAddress,
        contractType: "ERC20Asset",
        deploymentType: "asset",
        projectId: props.projectId,
        teamId: props.teamId,
      });

      reportContractDeployed({
        address: contractAddress,
        chainId: Number(formValues.chain),
        contractName: "DropERC20",
        deploymentType: "asset",
        publisher: account.address,
      });

      contractAddressRef.current = contractAddress;

      return {
        contractAddress: contractAddress,
      };
    } catch (e) {
      const parsedError = parseError(e);
      const errorMessage =
        typeof parsedError === "string" ? parsedError : "Unknown error";

      reportAssetCreationFailed({
        assetType: "coin",
        contractType: "DropERC20",
        error: errorMessage,
        step: "deploy-contract",
      });

      console.error(errorMessage);
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
      chain,
      client: props.client,
    });

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
        amountWei: toWei(totalAmountToAirdrop.toString()),
        contract: tokenContract,
        spender: entrypoint.address,
      });

      await sendAndConfirmTransaction({
        account,
        transaction: approvalTx,
      });
    } catch (e) {
      const errorMessage = parseError(e);

      reportAssetCreationFailed({
        assetType: "coin",
        contractType: "DropERC20",
        error: errorMessage,
        step: "airdrop-tokens",
      });

      throw e;
    }

    try {
      const airdropTx = await distributeToken({
        // eslint-disable-next-line no-restricted-syntax
        chain,
        client: props.client,
        contents: formValues.airdropAddresses.map((recipient) => ({
          amount: BigInt(recipient.quantity),
          recipient: recipient.address,
        })),
        tokenAddress: contractAddress,
      });

      await sendAndConfirmTransaction({
        account,
        transaction: airdropTx,
      });
    } catch (e) {
      console.error(e);
      const errorMessage = parseError(e);

      reportAssetCreationFailed({
        assetType: "coin",
        contractType: "DropERC20",
        error: errorMessage,
        step: "airdrop-tokens",
      });
      throw e;
    }
  }

  return (
    <CreateTokenAssetPageUI
      accountAddress={props.accountAddress}
      client={props.client}
      createTokenFunctions={{
        airdropTokens,
        deployContract,
      }}
      onLaunchSuccess={(params) => {
        createTokenOnUniversalBridge({
          chainId: params.chainId,
          client: props.client,
          tokenAddress: params.contractAddress,
        });
        revalidatePathAction(
          `/team/${props.teamSlug}/project/${props.projectId}/tokens`,
          "page",
        );
      }}
      projectSlug={props.projectSlug}
      teamSlug={props.teamSlug}
    />
  );
}
