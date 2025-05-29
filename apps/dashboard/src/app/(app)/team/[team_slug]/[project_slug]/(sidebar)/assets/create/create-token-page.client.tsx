"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
  getAddress,
} from "thirdweb";
import { TokenDistributionFieldset } from "./distribution/token-distribution";
import {
  type CreateAssetFormValues,
  type TokenDistributionFormValues,
  type TokenInfoFormValues,
  tokenDistributionFormSchema,
  tokenInfoFormSchema,
} from "./form";
import { LaunchTokenStatus } from "./launch/launch-token";
import { TokenInfoFieldset } from "./token-info-fieldset";

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
}) {
  const [step, setStep] = useState<"token-info" | "distribution" | "launch">(
    "token-info",
  );

  const tokenInfoForm = useForm<TokenInfoFormValues>({
    resolver: zodResolver(tokenInfoFormSchema),
    values: {
      name: "",
      description: "",
      symbol: "",
      image: undefined,
      chain: "1",
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
    },
    reValidateMode: "onChange",
  });

  const tokenDistributionForm = useForm<TokenDistributionFormValues>({
    resolver: zodResolver(tokenDistributionFormSchema),
    values: {
      // sale fieldset
      saleAllocationPercentage: "0",
      saleTokenAddress: checksummedNativeTokenAddress,
      salePrice: "0.1",
      supply: "1000000",
      saleEnabled: false,
      // airdrop
      airdropEnabled: false,
      airdropAddresses: [],
    },
    reValidateMode: "onChange",
  });

  return (
    <div>
      {step === "token-info" && (
        <TokenInfoFieldset
          onChainUpdated={() => {
            // if the chain is updated, set the sale token address to the native token address
            tokenDistributionForm.setValue(
              "saleTokenAddress",
              checksummedNativeTokenAddress,
            );
          }}
          client={props.client}
          form={tokenInfoForm}
          onNext={() => {
            setStep("distribution");
          }}
        />
      )}

      {step === "distribution" && (
        <TokenDistributionFieldset
          client={props.client}
          form={tokenDistributionForm}
          accountAddress={props.accountAddress}
          chainId={tokenInfoForm.watch("chain")}
          onPrevious={() => {
            setStep("token-info");
          }}
          onNext={() => {
            setStep("launch");
          }}
        />
      )}

      {step === "launch" && (
        <LaunchTokenStatus
          teamSlug={props.teamSlug}
          projectSlug={props.projectSlug}
          client={props.client}
          onLaunchSuccess={props.onLaunchSuccess}
          onPrevious={() => {
            setStep("distribution");
          }}
          createTokenFunctions={props.createTokenFunctions}
          values={{
            ...tokenInfoForm.getValues(),
            ...tokenDistributionForm.getValues(),
          }}
        />
      )}
    </div>
  );
}
