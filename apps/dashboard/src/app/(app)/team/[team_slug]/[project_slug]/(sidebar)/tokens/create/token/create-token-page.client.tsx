"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getAddress,
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
} from "thirdweb";
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

export type CreateTokenFunctions = {
  deployContract: (values: CreateAssetFormValues) => Promise<{
    contractAddress: string;
  }>;
  setClaimConditions: (values: CreateAssetFormValues) => Promise<void>;
  mintTokens: (values: CreateAssetFormValues) => Promise<void>;
  airdropTokens: (values: CreateAssetFormValues) => Promise<void>;
};

const checksummedNativeTokenAddress = getAddress(NATIVE_TOKEN_ADDRESS);

export function CreateTokenAssetPageUI(props: {
  accountAddress: string;
  client: ThirdwebClient;
  createTokenFunctions: CreateTokenFunctions;
  onLaunchSuccess: () => void;
  teamSlug: string;
  projectSlug: string;
  teamPlan: Team["billingPlan"];
}) {
  const [step, setStep] = useState<"token-info" | "distribution" | "launch">(
    "token-info",
  );
  const activeWalletChain = useActiveWalletChain();

  const tokenInfoForm = useForm<TokenInfoFormValues>({
    defaultValues: {
      chain: activeWalletChain?.id.toString() || "1",
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
    resolver: zodResolver(tokenDistributionFormSchema),
    reValidateMode: "onChange",
    values: {
      airdropAddresses: [],
      // airdrop
      airdropEnabled: false,
      // sale fieldset
      saleAllocationPercentage: "0",
      saleEnabled: false,
      salePrice: "0.1",
      saleTokenAddress: checksummedNativeTokenAddress,
      supply: "1000000",
    },
  });

  return (
    <div>
      {step === "token-info" && (
        <TokenInfoFieldset
          client={props.client}
          form={tokenInfoForm}
          onChainUpdated={() => {
            // if the chain is updated, set the sale token address to the native token address
            tokenDistributionForm.setValue(
              "saleTokenAddress",
              checksummedNativeTokenAddress,
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
