import { FileOrBufferOrStringSchema } from "../../../core/schema/shared";
import { toSemver } from "../../common/index";
import {
  AddressSchema,
  BigNumberishSchema,
  BigNumberTransformSchema,
} from "../shared";
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
import { BigNumberish } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const BYOCContractMetadataSchema = CommonContractSchema.catchall(
  z.union([BigNumberTransformSchema, z.unknown()]),
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
export type Abi = z.input<typeof AbiSchema>;

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
export const FactoryDeploymentSchema = z.object({
  implementationAddresses: ChainIdToAddressSchema,
  implementationInitializerFunction: z.string().default("initialize"),
  factoryAddresses: ChainIdToAddressSchema.optional(),
});

/**
 * @internal
 */
export const ExtraPublishMetadataSchemaInput = z
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
    audit: FileOrBufferOrStringSchema.nullable().optional(),
    logo: FileOrBufferOrStringSchema.nullable().optional(),
    isDeployableViaFactory: z.boolean().optional(),
    isDeployableViaProxy: z.boolean().optional(),
    factoryDeploymentData: FactoryDeploymentSchema.optional(),
    constructorParams: z
      .record(
        z.string(),
        z
          .object({
            displayName: z.string().optional(),
            description: z.string().optional(),
          })
          .catchall(z.any()),
      )
      .optional(),
  })
  .catchall(z.any());

/**
 * @internal
 */
export const ExtraPublishMetadataSchemaOutput =
  ExtraPublishMetadataSchemaInput.extend({
    audit: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
  });
export type ExtraPublishMetadata = z.input<
  typeof ExtraPublishMetadataSchemaInput
>;

/**
 * @internal
 */
export const FullPublishMetadataSchemaInput = PreDeployMetadata.merge(
  ExtraPublishMetadataSchemaInput,
).extend({
  publisher: AddressSchema.optional(),
});
/**
 * @internal
 */
export const FullPublishMetadataSchemaOutput = PreDeployMetadata.merge(
  ExtraPublishMetadataSchemaOutput,
).extend({
  publisher: AddressSchema.optional(),
});
export type FullPublishMetadata = z.infer<
  typeof FullPublishMetadataSchemaOutput
>;

/**
 * @internal
 */
export const ProfileSchemaInput = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  avatar: FileOrBufferOrStringSchema.nullable().optional(),
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
