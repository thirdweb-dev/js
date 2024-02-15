import { FileOrBufferOrStringSchema } from "../../../core/schema/shared";
import { toSemver } from "../../common/version-checker";
import {
  BigNumberishSchema,
  BigNumberTransformSchema,
} from "../shared/BigNumberSchema";
import { AddressOrEnsSchema } from "../shared/AddressOrEnsSchema";
import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonPrimarySaleSchema,
  CommonRoyaltySchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";
import { BigNumberish } from "ethers";
import { z } from "zod";
import { MerkleSchema } from "./common/snapshots";

/**
 * @internal
 */
export const BYOCContractMetadataSchema = /* @__PURE__ */ (() =>
  CommonContractSchema.catchall(
    z.union([BigNumberTransformSchema, z.unknown()]),
  ))();

/**
 * @internal
 */
export type CustomContractMetadata = z.input<typeof BYOCContractMetadataSchema>;

/**
 * @internal
 */
export const CustomContractInput = /* @__PURE__ */ (() =>
  BYOCContractMetadataSchema.merge(
    CommonRoyaltySchema.merge(MerkleSchema).merge(CommonSymbolSchema).partial(),
  ).catchall(z.any()))();

/**
 * @internal
 */
export const CustomContractOutput = /* @__PURE__ */ (() =>
  CommonContractOutputSchema.merge(
    CommonRoyaltySchema.merge(MerkleSchema).merge(CommonSymbolSchema).partial(),
  ).catchall(z.any()))();

/**
 * @internal
 */
export const CustomContractDeploy = /* @__PURE__ */ (() =>
  CustomContractInput.merge(
    CommonPlatformFeeSchema.merge(CommonPrimarySaleSchema)
      .merge(CommonTrustedForwarderSchema)
      .partial(),
  ))();

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
const AbiTypeBaseSchema = /* @__PURE__ */ (() =>
  z
    .object({
      type: z.string(),
      name: z.string().default(""),
    })
    .catchall(z.any()))();

/**
 * @internal
 */
export const AbiTypeSchema = /* @__PURE__ */ (() =>
  AbiTypeBaseSchema.extend({
    stateMutability: z.string().optional(),
    components: z.array(AbiTypeBaseSchema).optional(),
  }).catchall(z.any()))();

/**
 * @internal
 */
export const AbiObjectSchema = /* @__PURE__ */ (() =>
  z
    .object({
      type: z.string(),
      name: z.string().default(""),
      inputs: z.array(AbiTypeSchema).default([]),
      outputs: z.array(AbiTypeSchema).default([]),
    })
    .catchall(z.any()))();

/**
 * @internal
 */
export const AbiSchema = /* @__PURE__ */ (() => z.array(AbiObjectSchema))();
// if we want to statically type this for external usage it has to *awlways* be the output type
export type Abi = z.output<typeof AbiSchema>;

// input type is only used internally
/**
 * @internal
 */
export type AbiInput = z.input<typeof AbiSchema>;

/**
 * @internal
 */
export const PreDeployMetadata = /* @__PURE__ */ (() =>
  z
    .object({
      name: z.string(),
      metadataUri: z.string(),
      bytecodeUri: z.string(),
      analytics: z.any().optional(),
    })
    .catchall(z.any()))();

/**
 * @internal
 */
export const ChainIdToAddressSchema = /* @__PURE__ */ (() =>
  z.record(z.string(), z.string()))();

/**
 * @internal
 */
export const CustomFactoryInput = /* @__PURE__ */ (() =>
  z.object({
    factoryFunction: z.string(),
    params: z
      .array(z.object({ name: z.string(), type: z.string() }))
      .default([]),
    customFactoryAddresses: ChainIdToAddressSchema,
  }))();

/**
 * @internal
 */
export const FactoryDeploymentSchema = /* @__PURE__ */ (() =>
  z.object({
    implementationAddresses: ChainIdToAddressSchema,
    implementationInitializerFunction: z.string().default("initialize"),
    customFactoryInput: CustomFactoryInput.optional(),
    factoryAddresses: ChainIdToAddressSchema.optional(),
  }))();

/**
 * @internal
 */
export const DeployTypeInput = /* @__PURE__ */ (() =>
  z.union([
    z.literal("standard"),
    z.literal("autoFactory"),
    z.literal("customFactory"),
  ]))();

/**
 * @internal
 */
export const RouterTypeInput = /* @__PURE__ */ (() =>
  z.union([
    z.literal("none"),
    z.literal("plugin"),
    z.literal("dynamic"),
    z.literal("extension-installer"),
  ]))();

/**
 * @internal
 */
export const DeploymentNetworkInput = /* @__PURE__ */ (() =>
  z.object({
    allNetworks: z.boolean().optional(),
    networksEnabled: z.array(z.number()).default([]),
  }))();

/**
 * @internal
 */
export const ExtraPublishMetadataSchemaInput = /* @__PURE__ */ (() =>
  z
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
      deployType: DeployTypeInput.optional(),
      routerType: RouterTypeInput.optional(),
      defaultExtensions: z
        .array(
          z.object({
            extensionName: z.string(),
            extensionVersion: z.string().default("latest"),
            publisherAddress: AddressOrEnsSchema,
          }),
        )
        .optional(),
      networksForDeployment: DeploymentNetworkInput.optional(),
      constructorParams: z
        .record(
          z.string(),
          z
            .object({
              displayName: z.string().optional(),
              description: z.string().optional(),
              defaultValue: z.string().optional(),
              hidden: z.boolean().optional(),
            })
            .catchall(z.any()),
        )
        .optional(),
      compositeAbi: AbiSchema.optional(),
    })
    .catchall(z.any()))();

/**
 * @internal
 */
export const ExtraPublishMetadataSchemaOutput = /* @__PURE__ */ (() =>
  ExtraPublishMetadataSchemaInput.extend({
    audit: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
  }))();

export type ExtraPublishMetadata = z.input<
  typeof ExtraPublishMetadataSchemaInput
>;

/**
 * @internal
 */
export const FullPublishMetadataSchemaInput = /* @__PURE__ */ (() =>
  PreDeployMetadata.merge(ExtraPublishMetadataSchemaInput).extend({
    publisher: AddressOrEnsSchema.optional(),
  }))();

/**
 * @internal
 */
export const FullPublishMetadataSchemaOutput = /* @__PURE__ */ (() =>
  PreDeployMetadata.merge(ExtraPublishMetadataSchemaOutput).extend({
    publisher: AddressOrEnsSchema.optional(),
  }))();

export type FullPublishMetadata = z.infer<
  typeof FullPublishMetadataSchemaOutput
>;

/**
 * @internal
 */
export const ProfileSchemaInput = /* @__PURE__ */ (() =>
  z.object({
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
  }))();

export const ProfileSchemaOutput = /* @__PURE__ */ (() =>
  ProfileSchemaInput.extend({
    avatar: z.string().nullable().optional(),
  }))();

export type ProfileMetadataInput = z.infer<typeof ProfileSchemaInput>;
export type ProfileMetadata = z.infer<typeof ProfileSchemaOutput>;

/**
 * @internal
 */
export const PublishedContractSchema = /* @__PURE__ */ (() =>
  z.object({
    id: z.string(),
    timestamp: BigNumberishSchema,
    metadataUri: z.string(),
  }))();

/**
 * @internal
 * Follows https://docs.soliditylang.org/en/v0.8.15/natspec-format.html
 */
export const ContractInfoSchema = /* @__PURE__ */ (() =>
  z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    details: z.string().optional(),
    notice: z.string().optional(),
  }))();

/**
 * @internal
 */
export const CompilerMetadataFetchedSchema = /* @__PURE__ */ (() =>
  z.object({
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
    isPartialAbi: z.boolean().optional(),
  }))();

/**
 * @internal
 */
export const PreDeployMetadataFetchedSchema = /* @__PURE__ */ (() =>
  PreDeployMetadata.merge(CompilerMetadataFetchedSchema).extend({
    bytecode: z.string(),
  }))();

export type PreDeployMetadataFetched = z.infer<
  typeof PreDeployMetadataFetchedSchema
>;

export type ContractParam = z.input<typeof AbiTypeSchema>;
export type PublishedContract = z.infer<typeof PublishedContractSchema>;
export type PublishedContractFetched = {
  name: string;
  publishedTimestamp: BigNumberish;
  publishedMetadata: FullPublishMetadata;
};
export type AbiFunction = {
  name: string;
  inputs: z.output<typeof AbiTypeSchema>[];
  outputs: z.output<typeof AbiTypeSchema>[];
  signature: string;
  stateMutability: string;
  comment: string;
};
export type AbiEvent = {
  name: string;
  inputs: z.output<typeof AbiTypeSchema>[];
  outputs: z.output<typeof AbiTypeSchema>[];
  comment: string;
};
export type ContractSource = {
  filename: string;
  source: string;
};
export type PublishedMetadata = z.infer<typeof CompilerMetadataFetchedSchema>;
