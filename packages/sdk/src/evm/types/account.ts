import type {
  IAccountPermissions,
  IAccountPermissions_V1,
} from "@thirdweb-dev/contracts-js";
import { BigNumber, BytesLike } from "ethers";
import { z } from "zod";
import { AmountSchema } from "../../core/schema/shared";
import { AddressOrEnsSchema } from "../schema/shared/AddressOrEnsSchema";
import { EndDateSchema, StartDateSchema } from "../schema/shared/RawDateSchema";

export type SignerPermissions = {
  startDate: Date;
  expirationDate: Date;
  nativeTokenLimitPerTransaction: BigNumber;
  approvedCallTargets: string[];
};

export enum AdminFlag {
  None = 0,
  AddAdmin = 1,
  RemoveAdmin = 2,
}

export const DEFAULT_PERMISSIONS = {
  // eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
  startDate: BigNumber.from(0),
  // eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
  expirationDate: BigNumber.from(0),
  approvedCallTargets: [],
  nativeTokenLimitPerTransaction: "0",
};

export const SignerPermissionsSchema = /* @__PURE__ */ (() =>
  z.object({
    startDate: StartDateSchema,
    expirationDate: EndDateSchema,
    nativeTokenLimitPerTransaction: AmountSchema.default(0),
    approvedCallTargets: z.union([z.array(AddressOrEnsSchema), z.literal("*")]),
  }))();

export type SignerPermissionsInput = z.input<typeof SignerPermissionsSchema>;
export type SignerPermissionsOutput = z.output<typeof SignerPermissionsSchema>;

export type SignerWithPermissions = {
  isAdmin?: boolean;
  signer: string;
  permissions: SignerPermissions;
};

export const PermissionSnapshotSchema = /* @__PURE__ */ (() =>
  z.array(
    z.object({
      signer: AddressOrEnsSchema,
      makeAdmin: z.boolean(),
      permissions: SignerPermissionsSchema,
    }),
  ))();

export type PermissionSnapshotInput = z.input<typeof PermissionSnapshotSchema>;
export type PermissionSnapshotOutput = z.output<
  typeof PermissionSnapshotSchema
>;

export type SignedSignerPermissionsPayload = {
  payload: IAccountPermissions.SignerPermissionRequestStruct;
  signature: BytesLike;
};

export type SignedSignerPermissionsPayloadV1 = {
  payload: IAccountPermissions_V1.SignerPermissionRequestStruct;
  signature: BytesLike;
};

export const SignerPermissionRequestV1 = [
  { name: "signer", type: "address" },
  { name: "approvedTargets", type: "address[]" },
  { name: "nativeTokenLimitPerTransaction", type: "uint256" },
  { name: "permissionStartTimestamp", type: "uint128" },
  { name: "permissionEndTimestamp", type: "uint128" },
  { name: "reqValidityStartTimestamp", type: "uint128" },
  { name: "reqValidityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];

export const SignerPermissionRequest = [
  { name: "signer", type: "address" },
  { name: "isAdmin", type: "uint8" },
  { name: "approvedTargets", type: "address[]" },
  { name: "nativeTokenLimitPerTransaction", type: "uint256" },
  { name: "permissionStartTimestamp", type: "uint128" },
  { name: "permissionEndTimestamp", type: "uint128" },
  { name: "reqValidityStartTimestamp", type: "uint128" },
  { name: "reqValidityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];
