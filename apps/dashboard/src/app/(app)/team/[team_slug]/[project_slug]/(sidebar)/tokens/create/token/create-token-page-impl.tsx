"use client";
import { useRef } from "react";
import {
  defineChain,
  getAddress,
  getContract,
  NATIVE_TOKEN_ADDRESS,
  sendAndConfirmTransaction,
  type ThirdwebClient,
  toUnits,
} from "thirdweb";
import { deployERC20Contract } from "thirdweb/deploys";
import type { ClaimConditionsInput } from "thirdweb/dist/types/utils/extensions/drops/types";
import {
  claimTo,
  getActiveClaimCondition,
  setClaimConditions as setClaimConditionsExtension,
  transferBatch,
} from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { create7702MinimalAccount } from "thirdweb/wallets/smart";
import { revalidatePathAction } from "@/actions/revalidate";
import {
  reportAssetCreationFailed,
  reportContractDeployed,
} from "@/analytics/report";
import type { Team } from "@/api/team/get-team";
import {
  DEFAULT_FEE_BPS_NEW,
  DEFAULT_FEE_RECIPIENT,
} from "@/constants/addresses";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useAddContractToProject } from "@/hooks/project-contracts";
import { defineDashboardChain } from "@/lib/defineDashboardChain";
import { parseError } from "@/utils/errorParser";
import { pollWithTimeout } from "@/utils/pollWithTimeout";
import type { CreateAssetFormValues } from "./_common/form";
import { CreateTokenAssetPageUI } from "./create-token-page.client";

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
  const { idToChain } = useAllChainsData();
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
    const { values, gasless } = params;

    const account = getAccount(gasless);

    const socialUrls = values.socialUrls.reduce(
      (acc, url) => {
        if (url.url && url.platform) {
          acc[url.platform] = url.url;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    try {
      const contractAddress = await deployERC20Contract({
        account,
        // eslint-disable-next-line no-restricted-syntax
        chain: defineDashboardChain(
          Number(values.chain),
          idToChain.get(Number(values.chain)),
        ),
        client: props.client,
        params: {
          description: values.description,
          image: values.image,
          // metadata
          name: values.name,
          // platform fees
          platformFeeBps: BigInt(DEFAULT_FEE_BPS_NEW),
          platformFeeRecipient: DEFAULT_FEE_RECIPIENT,
          // primary sale
          saleRecipient: account.address,
          social_urls: socialUrls,
          symbol: values.symbol,
        },
        type: "DropERC20",
      });

      contractAddressRef.current = contractAddress;

      // add contract to project in background
      addContractToProject.mutateAsync({
        chainId: values.chain,
        contractAddress: contractAddress,
        contractType: "DropERC20",
        deploymentType: "asset",
        projectId: props.projectId,
        teamId: props.teamId,
      });

      reportContractDeployed({
        address: contractAddress,
        chainId: Number(values.chain),
        contractName: "DropERC20",
        deploymentType: "asset",
        publisher: "deployer.thirdweb.eth",
      });

      return {
        contractAddress: contractAddress,
      };
    } catch (e) {
      console.error(e);
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

    const contract = getDeployedContract({
      chain: values.chain,
    });

    const account = getAccount(gasless);

    if (!account) {
      throw new Error("No connected account");
    }

    try {
      const airdropTx = transferBatch({
        batch: values.airdropAddresses.map((recipient) => ({
          amount: recipient.quantity,
          to: recipient.address,
        })),
        contract,
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

  async function mintTokens(params: {
    values: CreateAssetFormValues;
    gasless: boolean;
  }) {
    const { values, gasless } = params;

    const contract = getDeployedContract({
      chain: values.chain,
    });

    const account = getAccount(gasless);

    // poll until claim conditions are set before moving on to minting
    await pollWithTimeout({
      shouldStop: async () => {
        const claimConditions = await getActiveClaimCondition({
          contract,
        });
        return !!claimConditions;
      },
      timeoutMs: 30000,
    });

    const totalSupply = Number(values.supply);
    const salePercent = values.saleEnabled
      ? Number(values.saleAllocationPercentage)
      : 0;

    const ownerAndAirdropPercent = 100 - salePercent;
    const ownerSupplyTokens = (totalSupply * ownerAndAirdropPercent) / 100;

    try {
      const claimTx = claimTo({
        contract,
        quantity: ownerSupplyTokens.toString(),
        to: account.address,
      });

      await sendAndConfirmTransaction({
        account,
        transaction: claimTx,
      });
    } catch (e) {
      const errorMessage = parseError(e);
      console.error(e);

      reportAssetCreationFailed({
        assetType: "coin",
        contractType: "DropERC20",
        error: errorMessage,
        step: "mint-tokens",
      });

      throw e;
    }
  }

  async function setClaimConditions(params: {
    values: CreateAssetFormValues;
    gasless: boolean;
  }) {
    const { values, gasless } = params;
    const contract = getDeployedContract({
      chain: values.chain,
    });

    const account = getAccount(gasless);

    const salePercent = values.saleEnabled
      ? Number(values.saleAllocationPercentage)
      : 0;

    const totalSupply = Number(values.supply);
    const totalSupplyWei = toUnits(totalSupply.toString(), 18);

    const phases: ClaimConditionsInput[] = [
      {
        currencyAddress:
          getAddress(values.saleTokenAddress) ===
          getAddress(NATIVE_TOKEN_ADDRESS)
            ? undefined
            : values.saleTokenAddress,
        maxClaimablePerWallet: values.saleEnabled ? undefined : 0n,
        maxClaimableSupply: totalSupplyWei,
        metadata: {
          name:
            values.saleEnabled && salePercent > 0
              ? "Coin Sale phase"
              : "Only Owner phase",
        },
        overrideList: [
          {
            address: account.address,
            maxClaimable: "unlimited",
            price: "0",
          },
        ],
        price: values.saleEnabled && salePercent > 0 ? values.salePrice : "0",
        startTime: new Date(),
      },
    ];

    const preparedTx = setClaimConditionsExtension({
      contract,
      phases,
    });

    try {
      await sendAndConfirmTransaction({
        account,
        transaction: preparedTx,
      });
    } catch (e) {
      const errorMessage = parseError(e);
      console.error(e);

      reportAssetCreationFailed({
        assetType: "coin",
        contractType: "DropERC20",
        error: errorMessage,
        step: "set-claim-conditions",
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
        mintTokens,
        setClaimConditions,
      }}
      onLaunchSuccess={() => {
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
