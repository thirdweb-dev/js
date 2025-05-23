"use client";
import { revalidatePathAction } from "@/actions/revalidate";
import {
  DEFAULT_FEE_BPS_NEW,
  DEFAULT_FEE_RECIPIENT,
} from "constants/addresses";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { defineDashboardChain } from "lib/defineDashboardChain";
import { useRef } from "react";
import { toast } from "sonner";
import {
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
  getAddress,
  getContract,
  sendAndConfirmTransaction,
  toUnits,
} from "thirdweb";
import { deployERC20Contract } from "thirdweb/deploys";
import type { ClaimConditionsInput } from "thirdweb/dist/types/utils/extensions/drops/types";
import {
  claimTo,
  setClaimConditions as setClaimConditionsExtension,
  transferBatch,
} from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { useAddContractToProject } from "../../hooks/project-contracts";
import { CreateTokenAssetPageUI } from "./create-token-page.client";
import type { CreateAssetFormValues } from "./form";
import {
  getTokenDeploymentTrackingData,
  getTokenStepTrackingData,
} from "./tracking";

export function CreateTokenAssetPage(props: {
  accountAddress: string;
  client: ThirdwebClient;
  teamId: string;
  projectId: string;
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
      getTokenDeploymentTrackingData("attempt", Number(formValues.chain)),
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
      const contractAddress = await deployERC20Contract({
        account,
        // eslint-disable-next-line no-restricted-syntax
        chain: defineDashboardChain(
          Number(formValues.chain),
          idToChain.get(Number(formValues.chain)),
        ),
        client: props.client,
        type: "DropERC20",
        params: {
          // metadata
          name: formValues.name,
          description: formValues.description,
          symbol: formValues.symbol,
          image: formValues.image,
          // platform fees
          platformFeeBps: BigInt(DEFAULT_FEE_BPS_NEW),
          platformFeeRecipient: DEFAULT_FEE_RECIPIENT,
          // primary sale
          saleRecipient: account.address,
          social_urls: socialUrls,
        },
      });

      trackEvent(
        getTokenDeploymentTrackingData("success", Number(formValues.chain)),
      );

      // add contract to project in background
      addContractToProject.mutateAsync({
        teamId: props.teamId,
        projectId: props.projectId,
        contractAddress: contractAddress,
        chainId: formValues.chain,
        deploymentType: "asset",
        contractType: "DropERC20",
      });

      contractAddressRef.current = contractAddress;

      return {
        contractAddress: contractAddress,
      };
    } catch (e) {
      trackEvent(
        getTokenDeploymentTrackingData("error", Number(formValues.chain)),
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

    const contract = getContract({
      client: props.client,
      address: contractAddress,
      chain,
    });

    trackEvent(
      getTokenStepTrackingData({
        action: "airdrop",
        chainId: Number(formValues.chain),
        status: "attempt",
      }),
    );

    try {
      const airdropTx = transferBatch({
        contract,
        batch: formValues.airdropAddresses.map((recipient) => ({
          to: recipient.address,
          amount: recipient.quantity,
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
        }),
      );
      throw e;
    }
  }

  async function mintTokens(formValues: CreateAssetFormValues) {
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

    const contract = getContract({
      client: props.client,
      address: contractAddress,
      chain,
    });

    const totalSupply = Number(formValues.supply);
    const salePercent = formValues.saleEnabled
      ? Number(formValues.saleAllocationPercentage)
      : 0;

    const ownerAndAirdropPercent = 100 - salePercent;
    const ownerSupplyTokens = (totalSupply * ownerAndAirdropPercent) / 100;

    trackEvent(
      getTokenStepTrackingData({
        action: "mint",
        chainId: Number(formValues.chain),
        status: "attempt",
      }),
    );

    try {
      const claimTx = claimTo({
        contract,
        to: account.address,
        quantity: ownerSupplyTokens.toString(),
      });

      await sendAndConfirmTransaction({
        transaction: claimTx,
        account,
      });

      trackEvent(
        getTokenStepTrackingData({
          action: "mint",
          chainId: Number(formValues.chain),
          status: "success",
        }),
      );
    } catch (e) {
      trackEvent(
        getTokenStepTrackingData({
          action: "mint",
          chainId: Number(formValues.chain),
          status: "error",
        }),
      );
      throw e;
    }
  }

  async function setClaimConditions(formValues: CreateAssetFormValues) {
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

    const contract = getContract({
      client: props.client,
      address: contractAddress,
      chain,
    });

    const salePercent = formValues.saleEnabled
      ? Number(formValues.saleAllocationPercentage)
      : 0;

    const totalSupply = Number(formValues.supply);
    const totalSupplyWei = toUnits(totalSupply.toString(), 18);

    const phases: ClaimConditionsInput[] = [
      {
        maxClaimablePerWallet: formValues.saleEnabled ? undefined : 0n,
        maxClaimableSupply: totalSupplyWei,
        price:
          formValues.saleEnabled && salePercent > 0
            ? formValues.salePrice
            : "0",
        currencyAddress:
          getAddress(formValues.saleTokenAddress) ===
          getAddress(NATIVE_TOKEN_ADDRESS)
            ? undefined
            : formValues.saleTokenAddress,
        startTime: new Date(),
        metadata: {
          name:
            formValues.saleEnabled && salePercent > 0
              ? "Token Sale phase"
              : "Only Owner phase",
        },
        overrideList: [
          {
            address: account.address,
            maxClaimable: "unlimited",
            price: "0",
          },
        ],
      },
    ];

    const preparedTx = setClaimConditionsExtension({
      contract,
      phases,
    });

    trackEvent(
      getTokenStepTrackingData({
        action: "claim-conditions",
        chainId: Number(formValues.chain),
        status: "attempt",
      }),
    );

    try {
      await sendAndConfirmTransaction({
        transaction: preparedTx,
        account,
      });

      trackEvent(
        getTokenStepTrackingData({
          action: "claim-conditions",
          chainId: Number(formValues.chain),
          status: "success",
        }),
      );
    } catch (e) {
      trackEvent(
        getTokenStepTrackingData({
          action: "claim-conditions",
          chainId: Number(formValues.chain),
          status: "error",
        }),
      );
      throw e;
    }
  }

  return (
    <CreateTokenAssetPageUI
      accountAddress={props.accountAddress}
      client={props.client}
      onLaunchSuccess={() => {
        revalidatePathAction(
          `/team/${props.teamId}/project/${props.projectId}/assets`,
          "page",
        );
      }}
      createTokenFunctions={{
        deployContract,
        airdropTokens,
        mintTokens,
        setClaimConditions,
      }}
    />
  );
}
