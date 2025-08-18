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
  toWei,
} from "thirdweb";
import { deployERC20Contract } from "thirdweb/deploys";
import {
  approve,
  claimTo,
  getActiveClaimCondition,
  setClaimConditions as setClaimConditionsExtension,
  transferBatch,
} from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import {
  createToken,
  distributeToken,
  getDeployedEntrypointERC20,
} from "thirdweb/tokens";
import type { ClaimConditionsInput } from "thirdweb/utils";
import { create7702MinimalAccount } from "thirdweb/wallets/smart";
import { revalidatePathAction } from "@/actions/revalidate";
import { reportContractDeployed } from "@/analytics/report";
import type { Team } from "@/api/team/get-team";
import {
  DEFAULT_FEE_BPS_NEW,
  DEFAULT_FEE_RECIPIENT,
} from "@/constants/addresses";
import { useAddContractToProject } from "@/hooks/project-contracts";
import { pollWithTimeout } from "@/utils/pollWithTimeout";
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

  // ERC20Asset ---

  async function Erc20Asset_deployContract(params: {
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

    const salePercent = params.values.saleEnabled
      ? Number(params.values.erc20Asset_poolMode.saleAllocationPercentage)
      : 0;

    const saleAmount = Math.floor(
      Number(params.values.supply) * (salePercent / 100),
    );

    const contractAddress = await createToken({
      account,
      // eslint-disable-next-line no-restricted-syntax
      chain: defineChain(Number(params.values.chain)),
      client: props.client,
      launchConfig:
        params.values.saleEnabled && saleAmount !== 0
          ? {
              kind: "pool",
              config: {
                amount: BigInt(saleAmount),
                initialTick: getInitialTickValue({
                  startingPricePerToken: Number(
                    params.values.erc20Asset_poolMode.startingPricePerToken,
                  ),
                }),
                developerRewardBps: 1250, // 12.5%
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
      developerAddress: "0x1Af20C6B23373350aD464700B5965CE4B0D2aD94",
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
  }

  async function ERC20Asset_airdropTokens(params: {
    values: CreateAssetFormValues;
    gasless: boolean;
  }) {
    const { values, gasless } = params;
    const account = getAccount(gasless);
    const contract = getDeployedContract({ chain: values.chain });

    const airdropTx = await distributeToken({
      chain: contract.chain,
      client: props.client,
      contents: values.airdropAddresses.map((recipient) => ({
        amount: recipient.quantity,
        recipient: recipient.address,
      })),
      tokenAddress: contract.address,
    });

    await sendAndConfirmTransaction({
      account,
      transaction: airdropTx,
    });
  }

  async function ERC20Asset_approveAirdropTokens(params: {
    values: CreateAssetFormValues;
    gasless: boolean;
  }) {
    const { values, gasless } = params;
    const account = getAccount(gasless);
    const contract = getDeployedContract({ chain: values.chain });

    const totalAmountToAirdrop = values.airdropAddresses.reduce(
      (acc, recipient) => acc + Number(recipient.quantity),
      0,
    );

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
  }

  // DropERC20 ----

  async function DropERC20_deployContract(params: {
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

    const contractAddress = await deployERC20Contract({
      account,
      // eslint-disable-next-line no-restricted-syntax
      chain: defineChain(Number(values.chain)),
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
  }

  async function DropERC20_airdropTokens(params: {
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
  }

  async function DropERC20_mintTokens(params: {
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
      ? Number(values.dropERC20Mode.saleAllocationPercentage)
      : 0;

    const ownerAndAirdropPercent = 100 - salePercent;
    const ownerSupplyTokens = (totalSupply * ownerAndAirdropPercent) / 100;

    const claimTx = claimTo({
      contract,
      quantity: ownerSupplyTokens.toString(),
      to: account.address,
    });

    await sendAndConfirmTransaction({
      account,
      transaction: claimTx,
    });
  }

  async function DropERC20_setClaimConditions(params: {
    values: CreateAssetFormValues;
    gasless: boolean;
  }) {
    const { values, gasless } = params;
    const contract = getDeployedContract({
      chain: values.chain,
    });

    const account = getAccount(gasless);

    const salePercent = values.saleEnabled
      ? Number(values.dropERC20Mode.saleAllocationPercentage)
      : 0;

    const totalSupply = Number(values.supply);
    const totalSupplyWei = toUnits(totalSupply.toString(), 18);

    const phases: ClaimConditionsInput[] = [
      {
        currencyAddress:
          getAddress(values.dropERC20Mode.saleTokenAddress) ===
          getAddress(NATIVE_TOKEN_ADDRESS)
            ? undefined
            : values.dropERC20Mode.saleTokenAddress,
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
        price:
          values.saleEnabled && salePercent > 0
            ? values.dropERC20Mode.pricePerToken
            : "0",
        startTime: new Date(),
      },
    ];

    const preparedTx = setClaimConditionsExtension({
      contract,
      phases,
    });

    await sendAndConfirmTransaction({
      account,
      transaction: preparedTx,
    });
  }

  return (
    <CreateTokenAssetPageUI
      accountAddress={props.accountAddress}
      client={props.client}
      createTokenFunctions={{
        ERC20Asset: {
          airdropTokens: ERC20Asset_airdropTokens,
          deployContract: Erc20Asset_deployContract,
          approveAirdropTokens: ERC20Asset_approveAirdropTokens,
        },
        DropERC20: {
          deployContract: DropERC20_deployContract,
          airdropTokens: DropERC20_airdropTokens,
          mintTokens: DropERC20_mintTokens,
          setClaimConditions: DropERC20_setClaimConditions,
        },
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
