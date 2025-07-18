"use client";
import { useRef } from "react";
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
import { create7702MinimalAccount } from "thirdweb/wallets/smart";
import { revalidatePathAction } from "@/actions/revalidate";
import {
  reportAssetCreationFailed,
  reportContractDeployed,
} from "@/analytics/report";
import type { Team } from "@/api/team";
import { useAddContractToProject } from "@/hooks/project-contracts";
import { parseError } from "@/utils/errorParser";
import { createTokenOnUniversalBridge } from "../_apis/create-token-on-bridge";
import type { CreateAssetFormValues } from "./_common/form";
import { CreateTokenAssetPageUI } from "./create-token-page.client";
import { getInitialTickValue } from "./utils/calculate-tick";

export function CreateTokenAssetPage(props: {
  accountAddress: string;
  client: ThirdwebClient;
  teamId: string;
  projectId: string;
  teamSlug: string;
  projectSlug: string;
  teamPlan: Team["billingPlan"];
}) {
  const activeAccount = useActiveAccount();
  const addContractToProject = useAddContractToProject();
  const contractAddressRef = useRef<string | undefined>(undefined);

  function getAccount(gasless: boolean) {
    if (!activeAccount) {
      throw new Error("No Connected Wallet");
    }

    if (gasless) {
      return create7702MinimalAccount({
        adminAccount: activeAccount,
        client: props.client,
        sponsorGas: true,
      });
    }
    return activeAccount;
  }

  function getDeployedContract(params: { chain: string }) {
    const contractAddress = contractAddressRef.current;

    if (!contractAddress) {
      throw new Error("Contract address not set");
    }

    // eslint-disable-next-line no-restricted-syntax
    const chain = defineChain(Number(params.chain));

    return getContract({
      address: contractAddress,
      chain,
      client: props.client,
    });
  }

  async function deployContract(params: {
    values: CreateAssetFormValues;
    gasless: boolean;
  }) {
    const account = getAccount(params.gasless);

    const socialUrls = params.values.socialUrls.reduce(
      (acc, url) => {
        if (url.url && url.platform) {
          acc[url.platform] = url.url;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    try {
      const salePercent =
        params.values.saleMode === "pool"
          ? Number(params.values.saleAllocationPercentage)
          : 0;

      const saleAmount = Number(params.values.supply) * (salePercent / 100);

      const contractAddress = await createToken({
        account,
        // eslint-disable-next-line no-restricted-syntax
        chain: defineChain(Number(params.values.chain)),
        client: props.client,
        launchConfig:
          params.values.saleMode === "pool" && saleAmount !== 0
            ? {
                kind: "pool",
                config: {
                  amount: BigInt(saleAmount),
                  initialTick: getInitialTickValue({
                    startingPricePerToken: Number(
                      params.values.pool.startingPricePerToken,
                    ),
                  }),
                  referrerRewardBps: 1250, // 12.5%
                },
              }
            : undefined,
        params: {
          description: params.values.description,
          image: params.values.image,
          maxSupply: BigInt(params.values.supply),
          name: params.values.name,
          social_urls: socialUrls,
          symbol: params.values.symbol,
        },
        referrerAddress: "0x1Af20C6B23373350aD464700B5965CE4B0D2aD94",
      });

      // add contract to project in background
      addContractToProject.mutateAsync({
        chainId: params.values.chain,
        contractAddress: contractAddress,
        contractType: "ERC20Asset",
        deploymentType: "asset",
        projectId: props.projectId,
        teamId: props.teamId,
      });

      reportContractDeployed({
        address: contractAddress,
        chainId: Number(params.values.chain),
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

  async function airdropTokens(params: {
    values: CreateAssetFormValues;
    gasless: boolean;
  }) {
    const { values, gasless } = params;
    const account = getAccount(gasless);
    const contract = getDeployedContract({ chain: values.chain });

    const totalAmountToAirdrop = values.airdropAddresses.reduce(
      (acc, recipient) => acc + BigInt(recipient.quantity),
      0n,
    );

    // approve entrypoint to spend tokens

    try {
      const entrypoint = await getDeployedEntrypointERC20({
        chain: contract.chain,
        client: props.client,
      });

      if (!entrypoint) {
        throw new Error("Entrypoint not found");
      }

      const approvalTx = approve({
        amountWei: toWei(totalAmountToAirdrop.toString()),
        contract: contract,
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
        chain: contract.chain,
        client: props.client,
        contents: values.airdropAddresses.map((recipient) => ({
          amount: BigInt(recipient.quantity),
          recipient: recipient.address,
        })),
        tokenAddress: contract.address,
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
      teamPlan={props.teamPlan}
      teamSlug={props.teamSlug}
    />
  );
}
