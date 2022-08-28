import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonPrimarySaleSchema,
  CommonRoyaltySchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
  MerkleSchema,
} from "./common";
import { z } from "zod";
import {
  AddressSchema,
  BigNumberishSchema,
  FileBufferOrStringSchema,
  JsonSchema,
} from "../shared";
import { BigNumberish } from "ethers";
import { toSemver } from "../../common/index";
import { ChainId, CONTRACT_ADDRESSES } from "../../constants/index";

/**
 * @internal
 */
export const BYOCContractMetadataSchema = CommonContractSchema.catchall(
  z.lazy(() => JsonSchema),
);

/**
 * @internal
 */
export type CustomContractMetadata = z.input<typeof BYOCContractMetadataSchema>;

/**
 * @internal
 */
export const CustomContractInput = BYOCContractMetadataSchema.merge(
  CommonRoyaltySchema.merge(MerkleSchema).merge(CommonSymbolSchema).partial(),
);

/**
 * @internal
 */
export const CustomContractOutput = CommonContractOutputSchema.merge(
  CommonRoyaltySchema.merge(MerkleSchema).merge(CommonSymbolSchema).partial(),
);

/**
 * @internal
 */
export const CustomContractDeploy = CustomContractInput.merge(
  CommonPlatformFeeSchema.merge(CommonPrimarySaleSchema)
    .merge(CommonTrustedForwarderSchema)
    .partial(),
);

/**
 * @internal
 */
export const CustomContractSchema = {
  deploy: CustomContractDeploy,
  output: CustomContractOutput,
  input: CustomContractInput,
};

/**
 * @internal
 */
const AbiTypeBaseSchema = z
  .object({
    type: z.string(),
    name: z.string(),
  })
  .catchall(z.any());

/**
 * @internal
 */
export const AbiTypeSchema = AbiTypeBaseSchema.extend({
  stateMutability: z.string().optional(),
  components: z.array(AbiTypeBaseSchema).optional(),
}).catchall(z.any());

/**
 * @internal
 */
export const AbiObjectSchema = z
  .object({
    type: z.string(),
    name: z.string().default(""),
    inputs: z.array(AbiTypeSchema).default([]),
    outputs: z.array(AbiTypeSchema).default([]),
  })
  .catchall(z.any());

/**
 * @internal
 */
export const AbiSchema = z.array(AbiObjectSchema);

/**
 * @internal
 */
export const PreDeployMetadata = z
  .object({
    name: z.string(),
    metadataUri: z.string(),
    bytecodeUri: z.string(),
    analytics: z.any().optional(),
  })
  .catchall(z.any());

/**
 * @internal
 */
export const ChainIdToAddressSchema = z.record(z.string(), z.string());

/**
 * @internal
 */
// TODO should have an input and ouput version of this schema
export const FactoryDeploymentSchema = z.object({
  implementationAddresses: ChainIdToAddressSchema,
  implementationInitializerFunction: z.string().default("initialize"),
  factoryAddresses: ChainIdToAddressSchema.default({
    [ChainId.Mainnet]: CONTRACT_ADDRESSES[ChainId.Mainnet].twFactory,
    [ChainId.Goerli]: CONTRACT_ADDRESSES[ChainId.Goerli].twFactory,
    [ChainId.Rinkeby]: CONTRACT_ADDRESSES[ChainId.Rinkeby].twFactory,
    [ChainId.Polygon]: CONTRACT_ADDRESSES[ChainId.Polygon].twFactory,
    [ChainId.Mumbai]: CONTRACT_ADDRESSES[ChainId.Mumbai].twFactory,
    [ChainId.Fantom]: CONTRACT_ADDRESSES[ChainId.Fantom].twFactory,
    [ChainId.FantomTestnet]:
      CONTRACT_ADDRESSES[ChainId.FantomTestnet].twFactory,
    [ChainId.Optimism]: CONTRACT_ADDRESSES[ChainId.Optimism].twFactory,
    [ChainId.OptimismTestnet]:
      CONTRACT_ADDRESSES[ChainId.OptimismTestnet].twFactory,
    [ChainId.Arbitrum]: CONTRACT_ADDRESSES[ChainId.Arbitrum].twFactory,
    [ChainId.ArbitrumTestnet]:
      CONTRACT_ADDRESSES[ChainId.ArbitrumTestnet].twFactory,
  }),
});

/**
 * @internal
 */
export const ExtraPublishMetadataSchema = z
  .object({
    version: z.string().refine(
      (v) => {
        try {
          toSemver(v);
          return true;
        } catch (e) {
          return false;
        }
      },
      (out) => {
        return {
          message: `'${out}' is not a valid semantic version. Should be in the format of major.minor.patch. Ex: 0.4.1`,
        };
      },
    ),
    displayName: z.string().optional(),
    description: z.string().optional(),
    readme: z.string().optional(),
    license: z.string().optional(),
    changelog: z.string().optional(),
    tags: z.array(z.string()).optional(),
    audit: FileBufferOrStringSchema.nullable().optional(),
    logo: FileBufferOrStringSchema.nullable().optional(),
    isDeployableViaFactory: z.boolean().optional(),
    factoryDeploymentData: FactoryDeploymentSchema.partial().optional(),
  })
  .catchall(z.any());
export type ExtraPublishMetadata = z.infer<typeof ExtraPublishMetadataSchema>;

/**
 * @internal
 */
export const FullPublishMetadataSchema = PreDeployMetadata.merge(
  ExtraPublishMetadataSchema,
).extend({
  publisher: AddressSchema.optional(),
});
export type FullPublishMetadata = z.infer<typeof FullPublishMetadataSchema>;

/**
 * @internal
 */
export const ProfileSchemaInput = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  avatar: FileBufferOrStringSchema.nullable().optional(),
  website: z.string().optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  facebook: z.string().optional(),
  github: z.string().optional(),
  medium: z.string().optional(),
  linkedin: z.string().optional(),
  reddit: z.string().optional(),
  discord: z.string().optional(),
});
export const ProfileSchemaOutput = ProfileSchemaInput.extend({
  avatar: z.string().nullable().optional(),
});
export type ProfileMetadataInput = z.infer<typeof ProfileSchemaInput>;
export type ProfileMetadata = z.infer<typeof ProfileSchemaOutput>;

/**
 * @internal
 */
export const PublishedContractSchema = z.object({
  id: z.string(),
  timestamp: BigNumberishSchema,
  metadataUri: z.string(),
});

/**
 * @internal
 * Follows https://docs.soliditylang.org/en/v0.8.15/natspec-format.html
 */
export const ContractInfoSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  details: z.string().optional(),
  notice: z.string().optional(),
});

/**
 * @internal
 */
export const CompilerMetadataFetchedSchema = z.object({
  name: z.string(),
  abi: AbiSchema,
  metadata: z.record(z.string(), z.any()),
  info: ContractInfoSchema,
  licenses: z
    .array(z.string().optional())
    .default([])
    .transform((v) => {
      return v.filter((license) => license !== undefined) as string[];
    }),
});

/**
 * @internal
 */
export const PreDeployMetadataFetchedSchema = PreDeployMetadata.merge(
  CompilerMetadataFetchedSchema,
).extend({
  bytecode: z.string(),
});

export type PreDeployMetadataFetched = z.infer<
  typeof PreDeployMetadataFetchedSchema
>;

export type ContractParam = z.infer<typeof AbiTypeSchema>;
export type PublishedContract = z.infer<typeof PublishedContractSchema>;
export type PublishedContractFetched = {
  name: string;
  publishedTimestamp: BigNumberish;
  publishedMetadata: FullPublishMetadata;
};
export type AbiFunction = {
  name: string;
  inputs: z.infer<typeof AbiTypeSchema>[];
  outputs: z.infer<typeof AbiTypeSchema>[];
  signature: string;
  stateMutability: string;
  comment: string;
};
export type AbiEvent = {
  name: string;
  inputs: z.infer<typeof AbiTypeSchema>[];
  outputs: z.infer<typeof AbiTypeSchema>[];
  comment: string;
};
export type ContractSource = {
  filename: string;
  source: string;
};
export type PublishedMetadata = z.infer<typeof CompilerMetadataFetchedSchema>;
