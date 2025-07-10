"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getAddress,
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
} from "thirdweb";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { reportAssetCreationStepConfigured } from "@/analytics/report";
import type { Team } from "@/api/team";
import {
  type CreateNFTCollectionFunctions,
  type NFTCollectionInfoFormValues,
  type NFTSalesSettingsFormValues,
  nftCollectionInfoFormSchema,
  nftSalesSettingsFormSchema,
} from "./_common/form";
import { nftCreationPages } from "./_common/pages";
import { NFTCollectionInfoFieldset } from "./collection-info/nft-collection-info-fieldset";
import { LaunchNFT } from "./launch/launch-nft";
import { SalesSettings } from "./sales/sales-settings";
import { type NFTData, UploadNFTsFieldset } from "./upload-nfts/upload-nfts";

export function CreateNFTPageUI(props: {
  accountAddress: string;
  client: ThirdwebClient;
  createNFTFunctions: CreateNFTCollectionFunctions;
  onLaunchSuccess: () => void;
  teamSlug: string;
  projectSlug: string;
  teamPlan: Team["billingPlan"];
}) {
  const [step, setStep] =
    useState<keyof typeof nftCreationPages>("collection-info");

  const activeAccount = useActiveAccount();

  const [nftData, setNFTData] = useState<NFTData>({
    nft: null,
    type: "single",
  });

  const nftSalesSettingsForm = useForm<NFTSalesSettingsFormValues>({
    defaultValues: {
      primarySaleRecipient: activeAccount?.address || "",
      royaltyBps: 0,
      royaltyRecipient: activeAccount?.address || "",
    },
    resolver: zodResolver(nftSalesSettingsFormSchema),
  });

  const nftCollectionInfoForm = useNFTCollectionInfoForm();

  return (
    <div>
      {step === nftCreationPages["collection-info"] && (
        <NFTCollectionInfoFieldset
          client={props.client}
          form={nftCollectionInfoForm}
          onChainUpdated={() => {
            // reset price currency to native token when chain is updated
            if (nftData.type === "single" && nftData.nft) {
              setNFTData({
                nft: {
                  ...nftData.nft,
                  price_currency: getAddress(NATIVE_TOKEN_ADDRESS),
                },
                type: "single",
              });
            }

            if (nftData.type === "multiple" && nftData.nfts?.type === "data") {
              setNFTData({
                nfts: {
                  data: nftData.nfts.data.map((x) => {
                    return {
                      ...x,
                      price_currency: getAddress(NATIVE_TOKEN_ADDRESS),
                    };
                  }),
                  type: "data",
                },
                type: "multiple",
              });
            }
          }}
          onNext={() => {
            reportAssetCreationStepConfigured({
              assetType: "nft",
              step: "collection-info",
            });
            setStep(nftCreationPages["upload-assets"]);
          }}
        />
      )}

      {step === nftCreationPages["upload-assets"] && (
        <UploadNFTsFieldset
          chainId={Number(nftCollectionInfoForm.watch("chain"))}
          client={props.client}
          nftData={nftData}
          onNext={() => {
            reportAssetCreationStepConfigured({
              assetType: "nft",
              step: "upload-assets",
            });
            setStep(nftCreationPages["sales-settings"]);
          }}
          onPrev={() => {
            setStep(nftCreationPages["collection-info"]);
          }}
          setNFTData={setNFTData}
        />
      )}

      {step === nftCreationPages["sales-settings"] && (
        <SalesSettings
          client={props.client}
          form={nftSalesSettingsForm}
          onNext={() => {
            reportAssetCreationStepConfigured({
              assetType: "nft",
              step: "sales-settings",
            });
            setStep(nftCreationPages["launch-nft"]);
          }}
          onPrev={() => {
            setStep(nftCreationPages["upload-assets"]);
          }}
        />
      )}

      {step === nftCreationPages["launch-nft"] && (
        <LaunchNFT
          client={props.client}
          createNFTFunctions={props.createNFTFunctions}
          onLaunchSuccess={props.onLaunchSuccess}
          onPrevious={() => {
            setStep(nftCreationPages["sales-settings"]);
          }}
          projectSlug={props.projectSlug}
          teamPlan={props.teamPlan}
          teamSlug={props.teamSlug}
          values={{
            collectionInfo: nftCollectionInfoForm.watch(),
            nfts:
              nftData.type === "multiple"
                ? nftData.nfts?.type === "data"
                  ? nftData.nfts.data
                  : []
                : nftData.nft
                  ? [nftData.nft]
                  : [],
            sales: nftSalesSettingsForm.watch(),
          }}
        />
      )}
    </div>
  );
}

function useNFTCollectionInfoForm() {
  const chain = useActiveWalletChain();
  const account = useActiveAccount();
  return useForm<NFTCollectionInfoFormValues>({
    defaultValues: {
      admins: [
        {
          address: account?.address || "",
        },
      ],
      chain: chain?.id.toString() || "1",
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
    resolver: zodResolver(nftCollectionInfoFormSchema),
    reValidateMode: "onChange",
  });
}
