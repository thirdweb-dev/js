import * as z from "zod";
import {
  addressArraySchema,
  addressSchema,
  socialUrlsSchema,
} from "../../_common/schema";
import type { NFTMetadataWithPrice } from "../upload-nfts/batch-upload/process-files";

export const nftCollectionInfoFormSchema = z.object({
  admins: addressArraySchema.refine((addresses) => addresses.length > 0, {
    message: "At least one admin is required",
  }),
  chain: z.string().min(1, "Chain is required"),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
  name: z.string().min(1, "Name is required"),
  socialUrls: socialUrlsSchema,
  symbol: z.string(),
});

export const nftSalesSettingsFormSchema = z.object({
  primarySaleRecipient: addressSchema,
  royaltyBps: z.coerce.number().min(0).max(10000),
  royaltyRecipient: addressSchema,
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
  setAdmins: (values: {
    contractAddress: string;
    contractType: "DropERC721" | "DropERC1155";
    admins: {
      address: string;
    }[];
    chain: string;
    gasless: boolean;
  }) => Promise<void>;
  erc721: {
    deployContract: (params: {
      values: CreateNFTCollectionAllValues;
      gasless: boolean;
    }) => Promise<{
      contractAddress: string;
    }>;
    setClaimConditions: (params: {
      values: CreateNFTCollectionAllValues;
      gasless: boolean;
    }) => Promise<void>;
    lazyMintNFTs: (params: {
      values: CreateNFTCollectionAllValues;
      gasless: boolean;
    }) => Promise<void>;
  };
  erc1155: {
    deployContract: (params: {
      values: CreateNFTCollectionAllValues;
      gasless: boolean;
    }) => Promise<{
      contractAddress: string;
    }>;
    setClaimConditions: (params: {
      values: CreateNFTCollectionAllValues;
      batch: {
        startIndex: number;
        count: number;
      };
      gasless: boolean;
      onNotEnoughFunds: (data: {
        requiredAmount: string;
        balance: string;
      }) => void;
    }) => Promise<void>;
    lazyMintNFTs: (params: {
      values: CreateNFTCollectionAllValues;
      gasless: boolean;
    }) => Promise<void>;
  };
};

export type NFTSalesSettingsFormValues = z.infer<
  typeof nftSalesSettingsFormSchema
>;
