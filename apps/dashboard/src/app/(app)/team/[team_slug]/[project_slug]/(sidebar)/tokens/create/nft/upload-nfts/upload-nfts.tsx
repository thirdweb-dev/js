import type { ThirdwebClient } from "thirdweb";
import { TabButtons } from "@/components/ui/tabs";
import { StepCard } from "../../_common/step-card";
import { BatchUploadNFTs } from "./batch-upload/batch-upload-nfts";
import type {
  NFTMetadataWithPrice,
  ProcessBatchUploadFilesResult,
} from "./batch-upload/process-files";
import { SingleUploadNFT } from "./single-upload/single-upload-nft";

export type NFTData =
  | {
      type: "multiple";
      nfts: ProcessBatchUploadFilesResult | null;
    }
  | {
      type: "single";
      nft: NFTMetadataWithPrice | null;
    };

export function UploadNFTsFieldset(props: {
  client: ThirdwebClient;
  chainId: number;
  onNext: () => void;
  onPrev: () => void;
  nftData: NFTData;
  setNFTData: (nftData: NFTData) => void;
}) {
  return (
    <StepCard nextButton={undefined} prevButton={undefined} title="Upload NFTs">
      <TabButtons
        containerClassName="pt-2 px-4 md:px-6"
        tabClassName="!text-sm"
        tabs={[
          {
            isActive: props.nftData.type === "single",
            name: "Create Single",
            onClick: () =>
              props.setNFTData({
                nft: null,
                type: "single",
              }),
          },
          {
            isActive: props.nftData.type === "multiple",
            name: "Create Multiple",
            onClick: () => props.setNFTData({ nfts: null, type: "multiple" }),
          },
        ]}
      />

      {props.nftData.type === "multiple" && (
        <BatchUploadNFTs
          chainId={props.chainId}
          client={props.client}
          onNext={props.onNext}
          onPrev={props.onPrev}
          results={props.nftData.nfts}
          setResults={(results) =>
            props.setNFTData({
              nfts: results,
              type: "multiple",
            })
          }
        />
      )}

      {props.nftData.type === "single" && (
        <SingleUploadNFT
          chainId={props.chainId}
          client={props.client}
          nftData={props.nftData.nft}
          onNext={props.onNext}
          onPrev={props.onPrev}
          setNFTData={(nft) =>
            props.setNFTData({
              nft,
              type: "single",
            })
          }
        />
      )}
    </StepCard>
  );
}
