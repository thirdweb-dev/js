"use client";
import { useRef } from "react";
import {
  getAddress,
  getContract,
  NATIVE_TOKEN_ADDRESS,
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
  distributeToken,
  getDeployedEntrypointERC20,
  getTokenAddressFromReceipt,
  prepareCreateToken,
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
import { useGetV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { useAddContractToProject } from "@/hooks/project-contracts";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { pollWithTimeout } from "@/utils/pollWithTimeout";
import { createTokenOnUniversalBridge } from "../_apis/create-token-on-bridge";
import type { CreateAssetFormValues } from "./_common/form";
import { CreateTokenAssetPageUI } from "./create-token-page.client";
import { getInitialTickValue, isValidTickValue } from "./utils/calculate-tick";

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
  const getChain = useGetV5DashboardChain();
  const sendAndConfirmTx = useSendAndConfirmTx();

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

    const chain = getChain(Number(params.chain));

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

    const chain = getChain(Number(params.values.chain));

    let initialTick: number | undefined;

    if (params.values.saleEnabled && saleAmount !== 0) {
      initialTick = await getInitialTickValue({
        startingPricePerToken: Number(
          params.values.erc20Asset_poolMode.startingPricePerToken,
        ),
        tokenAddress: params.values.erc20Asset_poolMode.tokenAddress,
        chain,
        client: props.client,
      });

      if (!isValidTickValue(initialTick)) {
        throw new Error(
          "Invalid starting price per token. Change price and try again",
        );
      }
    }

    const createTokenTx = await prepareCreateToken({
      account,
      chain: chain,
      client: props.client,
      launchConfig:
        params.values.saleEnabled && saleAmount !== 0
          ? {
              kind: "pool",
              config: {
                amount: BigInt(saleAmount),
                initialTick: initialTick,
                developerRewardBps: 1250, // 12.5%
                currency:
                  getAddress(params.values.erc20Asset_poolMode.tokenAddress) ===
                  getAddress(NATIVE_TOKEN_ADDRESS)
                    ? undefined
                    : params.values.erc20Asset_poolMode.tokenAddress,
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

    const receipt = await sendAndConfirmTx.mutateAsync(createTokenTx);
    const contractAddress = await getTokenAddressFromReceipt(receipt);

    // add contract to project in background
    addContractToProject.mutateAsync({
      chainId: params.values.chain,
      contractAddress: contractAddress,
      contractType: "ERC20Asset",
      deploymentType: "asset",
      projectId: props.projectId,
      teamId: props.teamId,
    });

    const chainMetadata = getChain(Number(params.values.chain));
    reportContractDeployed({
      address: contractAddress,
      chainId: Number(params.values.chain),
      contractName: "ERC20Asset",
      deploymentType: "asset",
      publisher: account.address,
      is_testnet: chainMetadata.testnet,
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
    const { values } = params;
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

    await sendAndConfirmTx.mutateAsync(airdropTx);
  }

  async function ERC20Asset_approveAirdropTokens(params: {
    values: CreateAssetFormValues;
    gasless: boolean;
  }) {
    const { values } = params;
    // TODO - when gasless is enabled - change how the tx is sent
    // const account = getAccount(params.gasless);
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

    await sendAndConfirmTx.mutateAsync(approvalTx);
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

    const chain = getChain(Number(params.values.chain));

    const contractAddress = await deployERC20Contract({
      account,
      chain: chain,
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

    const chainMetadata = getChain(Number(values.chain));

    reportContractDeployed({
      address: contractAddress,
      chainId: Number(values.chain),
      contractName: "DropERC20",
      deploymentType: "asset",
      publisher: "deployer.thirdweb.eth",
      is_testnet: chainMetadata.testnet,
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

    await sendAndConfirmTx.mutateAsync(airdropTx);
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

    await sendAndConfirmTx.mutateAsync(claimTx);
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

    await sendAndConfirmTx.mutateAsync(preparedTx);
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
      onLaunchSuccess={(values, contractAddress) => {
        if (values.saleMode === "erc20-asset:pool") {
          createTokenOnUniversalBridge({
            chainId: Number(values.chain),
            client: props.client,
            tokenAddress: contractAddress,
            pairedTokenAddress: values.erc20Asset_poolMode.tokenAddress,
          });
        } else if (values.saleMode === "drop-erc20:token-drop") {
          createTokenOnUniversalBridge({
            chainId: Number(values.chain),
            client: props.client,
            tokenAddress: contractAddress,
            pairedTokenAddress: undefined,
          });
        }

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
