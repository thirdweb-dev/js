import { isAddress } from "thirdweb";
import * as z from "zod";
import { socialUrlsSchema } from "../../_common/schema";
import type { NFTMetadataWithPrice } from "../upload-nfts/batch-upload/process-files";

export const nftCollectionInfoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string(),
  chain: z.string().min(1, "Chain is required"),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
  socialUrls: socialUrlsSchema,
});

const addressSchema = z.string().refine((value) => {
  if (isAddress(value)) {
    return true;
  }

  return false;
});

export const nftSalesSettingsFormSchema = z.object({
  royaltyRecipient: addressSchema,
  primarySaleRecipient: addressSchema,
  royaltyBps: z.coerce.number().min(0).max(10000),
});

export type NFTCollectionInfoFormValues = z.infer<
  typeof nftCollectionInfoFormSchema
>;

export type CreateNFTCollectionAllValues = {
  collectionInfo: NFTCollectionInfoFormValues;
  nfts: NFTMetadataWithPrice[];
  sales: NFTSalesSettingsFormValues;
};

export type CreateNFTCollectionFunctions = {
  erc721: {
    deployContract: (values: CreateNFTCollectionAllValues) => Promise<{
      contractAddress: string;
    }>;
    setClaimConditions: (values: CreateNFTCollectionAllValues) => Promise<void>;
    lazyMintNFTs: (values: CreateNFTCollectionAllValues) => Promise<void>;
  };
  erc1155: {
    deployContract: (values: CreateNFTCollectionAllValues) => Promise<{
      contractAddress: string;
    }>;
    setClaimConditions: (params: {
      values: CreateNFTCollectionAllValues;
      batch: {
        startIndex: number;
        count: number;
      };
    }) => Promise<void>;
    lazyMintNFTs: (values: CreateNFTCollectionAllValues) => Promise<void>;
  };
};

export type NFTSalesSettingsFormValues = z.infer<
  typeof nftSalesSettingsFormSchema
>;
