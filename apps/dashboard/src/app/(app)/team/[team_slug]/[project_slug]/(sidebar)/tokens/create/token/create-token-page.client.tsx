"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWalletChain } from "thirdweb/react";
import { reportAssetCreationStepConfigured } from "@/analytics/report";
import type { Team } from "@/api/team";
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
  deployContract: (params: CreateTokenFunctionsParams) => Promise<{
    contractAddress: string;
  }>;
  airdropTokens: (values: CreateTokenFunctionsParams) => Promise<void>;
  approveAirdropTokens: (values: CreateTokenFunctionsParams) => Promise<void>;
};

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

  const tokenDistributionForm = useForm<TokenDistributionFormValues>({
    defaultValues: {
      airdropAddresses: [],
      // airdrop
      airdropEnabled: false,
      pool: {
        startingPricePerToken: "0.000000001", // 1gwei per token
      },
      // sale fieldset
      saleAllocationPercentage: "100",
      saleMode: "pool",
      supply: "1000000000", // 1 billion
    },
    mode: "onChange",
    resolver: zodResolver(tokenDistributionFormSchema),
    reValidateMode: "onChange",
  });

  return (
    <div>
      {step === "token-info" && (
        <TokenInfoFieldset
          client={props.client}
          form={tokenInfoForm}
          onChainUpdated={() => {
            // no op
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

      {step === "distribution" && (
        <TokenDistributionFieldset
          accountAddress={props.accountAddress}
          chainId={tokenInfoForm.watch("chain")}
          client={props.client}
          form={tokenDistributionForm}
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
      )}

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
