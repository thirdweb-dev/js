import {
  FileOrBuffer,
  isFileOrBuffer,
  type ThirdwebStorage,
} from "@thirdweb-dev/storage";
import { FEATURE_SHARED_METADATA } from "../../constants/erc721-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import type { ISharedMetadata } from "@thirdweb-dev/contracts-js";
import { buildTransactionFunction } from "../../common/transactions";
import { BasicNFTInput, NFT } from "../../../core/schema/nft";
import { Transaction } from "./transactions";
import { TransactionResultWithId } from "../types";

export class Erc721SharedMetadata implements DetectableFeature {
  featureName = FEATURE_SHARED_METADATA.name;

  private contractWrapper: ContractWrapper<ISharedMetadata>;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<ISharedMetadata>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  set = buildTransactionFunction(
    async (
      metadata: BasicNFTInput,
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      const parsedMetadata = BasicNFTInput.parse(metadata);

      // take the input and upload image and animation if it is not a URI already
      const batch: FileOrBuffer[] = [];
      if (isFileOrBuffer(parsedMetadata.image)) {
        batch.push(parsedMetadata.image);
      }
      if (isFileOrBuffer(parsedMetadata.animation_url)) {
        batch.push(parsedMetadata.animation_url);
      }
      const [imageUri, animationUri] = await this.storage.uploadBatch(batch);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setSharedMetadata",
        args: [
          {
            name: `${parsedMetadata.name || ""}`,
            description: parsedMetadata.description || "",
            imageURI: imageUri,
            animationURI: animationUri,
          },
        ],
      });
    },
  );
}
