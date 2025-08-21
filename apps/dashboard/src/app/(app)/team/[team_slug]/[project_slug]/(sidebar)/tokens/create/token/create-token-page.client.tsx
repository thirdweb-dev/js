"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getAddress,
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
} from "thirdweb";
import { useActiveWalletChain } from "thirdweb/react";
import {
  getDeployedContractFactory,
  isPoolRouterEnabled,
} from "thirdweb/tokens";
import { reportAssetCreationStepConfigured } from "@/analytics/report";
import type { Team } from "@/api/team/get-team";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { StepCard } from "../_common/step-card";
import {
  type CreateAssetFormValues,
  type TokenDistributionFormValues,
  type TokenInfoFormValues,
  tokenDistributionFormSchema,
  tokenInfoFormSchema,
} from "./_common/form";
import { TokenDistributionFieldset } from "./distribution/token-distribution";
import { LaunchTokenStatus } from "./launch/launch-token";
import { TokenInfoFieldset } from "./token-info/token-info-fieldset";

type CreateTokenFunctionsParams = {
  values: CreateAssetFormValues;
  gasless: boolean;
};

export type CreateTokenFunctions = {
  ERC20Asset: {
    deployContract: (params: CreateTokenFunctionsParams) => Promise<{
      contractAddress: string;
    }>;
    airdropTokens: (values: CreateTokenFunctionsParams) => Promise<void>;
    approveAirdropTokens: (values: CreateTokenFunctionsParams) => Promise<void>;
  };
  DropERC20: {
    deployContract: (params: CreateTokenFunctionsParams) => Promise<{
      contractAddress: string;
    }>;
    setClaimConditions: (params: CreateTokenFunctionsParams) => Promise<void>;
    mintTokens: (params: CreateTokenFunctionsParams) => Promise<void>;
    airdropTokens: (params: CreateTokenFunctionsParams) => Promise<void>;
  };
};

const nativeTokenAddress = getAddress(NATIVE_TOKEN_ADDRESS);

export function CreateTokenAssetPageUI(props: {
  accountAddress: string;
  client: ThirdwebClient;
  createTokenFunctions: CreateTokenFunctions;
  onLaunchSuccess: (params: {
    chainId: number;
    contractAddress: string;
  }) => void;
  teamSlug: string;
  projectSlug: string;
  teamPlan: Team["billingPlan"];
}) {
  const [step, setStep] = useState<"token-info" | "distribution" | "launch">(
    "token-info",
  );
  const activeChain = useActiveWalletChain();

  const tokenInfoForm = useForm<TokenInfoFormValues>({
    defaultValues: {
      chain: activeChain?.id.toString() || "8453",
      description: "",
      image: undefined,
      name: "",
      socialUrls: [
        {
          platform: "Website",
          url: "",
        },
        {
          platform: "Twitter",
          url: "",
        },
      ],
      symbol: "",
    },
    resolver: zodResolver(tokenInfoFormSchema),
    reValidateMode: "onChange",
  });

  const chain = useV5DashboardChain(Number(tokenInfoForm.watch("chain")));

  const isERC20AssetSupportedQuery = useQuery({
    queryKey: ["is-erc20-asset-supported", chain],
    queryFn: async () => {
      try {
        const res = await getDeployedContractFactory({
          // eslint-disable-next-line no-restricted-syntax
          chain: chain,
          client: props.client,
        });
        return !!res;
      } catch {
        return false;
      }
    },
  });

  const isAssetRouterEnabledQuery = useQuery({
    queryFn: async () => {
      try {
        return await isPoolRouterEnabled({
          chain: chain,
          client: props.client,
        });
      } catch {
        return false;
      }
    },
    queryKey: ["is-asset-router-enabled", chain],
  });

  const defaultSaleMode = isERC20AssetSupportedQuery.data
    ? "erc20-asset:pool"
    : "drop-erc20:token-drop";

  const tokenDistributionForm = useForm<TokenDistributionFormValues>({
    values: {
      airdropAddresses: [],
      // airdrop
      airdropEnabled: false,
      erc20Asset_poolMode: {
        startingPricePerToken: "0.000000001", // 1gwei per token
        saleAllocationPercentage: "100",
      },
      dropERC20Mode: {
        pricePerToken: "0.1",
        saleAllocationPercentage: "100",
        saleTokenAddress: nativeTokenAddress,
      },
      supply: "1000000000", // 1 billion
      saleEnabled: !(
        defaultSaleMode === "erc20-asset:pool" &&
        !isAssetRouterEnabledQuery.data
      ),
      saleMode: defaultSaleMode,
    },
    mode: "onChange",
    resolver: zodResolver(tokenDistributionFormSchema),
    reValidateMode: "onChange",
  });

  const distributionFieldIsPending =
    isERC20AssetSupportedQuery.isPending || isAssetRouterEnabledQuery.isPending;

  return (
    <div>
      {step === "token-info" && (
        <TokenInfoFieldset
          client={props.client}
          form={tokenInfoForm}
          onChainUpdated={() => {
            // reset the token address to the native token address on chain change
            tokenDistributionForm.setValue(
              "dropERC20Mode.saleTokenAddress",
              nativeTokenAddress,
            );
          }}
          onNext={() => {
            reportAssetCreationStepConfigured({
              assetType: "coin",
              step: "coin-info",
            });
            setStep("distribution");
          }}
        />
      )}

      {step === "distribution" &&
        (distributionFieldIsPending ? (
          <StepCard
            nextButton={{
              disabled: true,
              type: "submit",
            }}
            prevButton={{
              onClick: () => {
                setStep("token-info");
              },
            }}
            title="Coin Distribution"
          >
            <div className="h-[400px] flex items-center justify-center">
              <Spinner className="size-10" />
            </div>
          </StepCard>
        ) : (
          <TokenDistributionFieldset
            form={tokenDistributionForm}
            accountAddress={props.accountAddress}
            chainId={tokenInfoForm.watch("chain")}
            isRouterEnabled={isAssetRouterEnabledQuery.data === true}
            client={props.client}
            onNext={() => {
              reportAssetCreationStepConfigured({
                assetType: "coin",
                step: "token-distribution",
              });
              setStep("launch");
            }}
            onPrevious={() => {
              setStep("token-info");
            }}
            tokenSymbol={tokenInfoForm.watch("symbol")}
          />
        ))}

      {step === "launch" && (
        <LaunchTokenStatus
          client={props.client}
          createTokenFunctions={props.createTokenFunctions}
          onLaunchSuccess={props.onLaunchSuccess}
          onPrevious={() => {
            setStep("distribution");
          }}
          projectSlug={props.projectSlug}
          teamPlan={props.teamPlan}
          teamSlug={props.teamSlug}
          values={{
            ...tokenInfoForm.getValues(),
            ...tokenDistributionForm.getValues(),
          }}
        />
      )}
    </div>
  );
}
