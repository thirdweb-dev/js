import type { IAccountPermissions } from "@thirdweb-dev/contracts-js";
import { BigNumber, BytesLike } from "ethers";
import { z } from "zod";
import { AmountSchema } from "../../core/schema/shared";
import { EndDateSchema, StartDateSchema } from "../schema";
import { AddressOrEnsSchema } from "../schema";

export type SignerPermissions = {
  startDate: Date;
  expirationDate: Date;
  nativeTokenLimitPerTransaction: BigNumber;
  approvedCallTargets: string[];
};

export const SignerPermissionsSchema = /* @__PURE__ */ (() =>
  z.object({
    startDate: StartDateSchema,
    expirationDate: EndDateSchema,
    nativeTokenLimitPerTransaction: AmountSchema.default(0),
    approvedCallTargets: z.array(AddressOrEnsSchema),
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

export const SignerPermissionRequest = [
  { name: "signer", type: "address" },
  { name: "approvedTargets", type: "address[]" },
  { name: "nativeTokenLimitPerTransaction", type: "uint256" },
  { name: "permissionStartTimestamp", type: "uint128" },
  { name: "permissionEndTimestamp", type: "uint128" },
  { name: "reqValidityStartTimestamp", type: "uint128" },
  { name: "reqValidityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];
