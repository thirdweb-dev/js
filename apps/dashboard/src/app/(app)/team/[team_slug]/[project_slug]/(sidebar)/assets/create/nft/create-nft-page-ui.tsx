"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
  getAddress,
} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
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
import type {} from "./upload-nfts/batch-upload/process-files";
import { type NFTData, UploadNFTsFieldset } from "./upload-nfts/upload-nfts";

export function CreateNFTPageUI(props: {
  accountAddress: string;
  client: ThirdwebClient;
  createNFTFunctions: CreateNFTCollectionFunctions;
  onLaunchSuccess: () => void;
  teamSlug: string;
  projectSlug: string;
}) {
  const [step, setStep] =
    useState<keyof typeof nftCreationPages>("collection-info");

  const activeAccount = useActiveAccount();

  const [nftData, setNFTData] = useState<NFTData>({
    type: "single",
    nft: null,
  });

  const nftSalesSettingsForm = useForm<NFTSalesSettingsFormValues>({
    resolver: zodResolver(nftSalesSettingsFormSchema),
    defaultValues: {
      royaltyRecipient: activeAccount?.address || "",
      primarySaleRecipient: activeAccount?.address || "",
      royaltyBps: 0,
    },
  });

  const nftCollectionInfoForm = useNFTCollectionInfoForm();

  return (
    <div>
      {step === nftCreationPages["collection-info"] && (
        <NFTCollectionInfoFieldset
          onChainUpdated={() => {
            // reset price currency to native token when chain is updated
            if (nftData.type === "single" && nftData.nft) {
              setNFTData({
                type: "single",
                nft: {
                  ...nftData.nft,
                  price_currency: getAddress(NATIVE_TOKEN_ADDRESS),
                },
              });
            }

            if (nftData.type === "multiple" && nftData.nfts?.type === "data") {
              setNFTData({
                type: "multiple",
                nfts: {
                  type: "data",
                  data: nftData.nfts.data.map((x) => {
                    return {
                      ...x,
                      price_currency: getAddress(NATIVE_TOKEN_ADDRESS),
                    };
                  }),
                },
              });
            }
          }}
          client={props.client}
          form={nftCollectionInfoForm}
          onNext={() => {
            setStep(nftCreationPages["upload-assets"]);
          }}
        />
      )}

      {step === nftCreationPages["upload-assets"] && (
        <UploadNFTsFieldset
          nftData={nftData}
          setNFTData={setNFTData}
          onNext={() => {
            setStep(nftCreationPages["sales-settings"]);
          }}
          onPrev={() => {
            setStep(nftCreationPages["collection-info"]);
          }}
          client={props.client}
          chainId={Number(nftCollectionInfoForm.watch("chain"))}
        />
      )}

      {step === nftCreationPages["sales-settings"] && (
        <SalesSettings
          form={nftSalesSettingsForm}
          client={props.client}
          onNext={() => {
            setStep(nftCreationPages["launch-nft"]);
          }}
          onPrev={() => {
            setStep(nftCreationPages["upload-assets"]);
          }}
        />
      )}

      {step === nftCreationPages["launch-nft"] && (
        <LaunchNFT
          values={{
            collectionInfo: nftCollectionInfoForm.watch(),
            sales: nftSalesSettingsForm.watch(),
            nfts:
              nftData.type === "multiple"
                ? nftData.nfts?.type === "data"
                  ? nftData.nfts.data
                  : []
                : nftData.nft
                  ? [nftData.nft]
                  : [],
          }}
          onPrevious={() => {
            setStep(nftCreationPages["sales-settings"]);
          }}
          projectSlug={props.projectSlug}
          client={props.client}
          onLaunchSuccess={props.onLaunchSuccess}
          teamSlug={props.teamSlug}
          createNFTFunctions={props.createNFTFunctions}
        />
      )}
    </div>
  );
}

function useNFTCollectionInfoForm() {
  return useForm<NFTCollectionInfoFormValues>({
    resolver: zodResolver(nftCollectionInfoFormSchema),
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
}
