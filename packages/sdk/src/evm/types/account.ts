import type { IAccountPermissions } from "@thirdweb-dev/contracts-js";
import { BigNumber, BytesLike } from "ethers";
import { z } from "zod";
import { AmountSchema } from "../../core/schema/shared";
import { EndDateSchema, StartDateSchema } from "../schema";
import { AddressOrEnsSchema } from "../schema";

export type AccountEvent = {
  account: string;
  admin: string;
};

export type AccessRestrictions = {
  startDate: Date;
  expirationDate: Date;
  nativeTokenLimitPerTransaction: BigNumber;
  approvedCallTargets: string[];
};

export const AccessRestrictionsSchema = /* @__PURE__ */ z.object({
  startDate: StartDateSchema,
  expirationDate: EndDateSchema,
  nativeTokenLimitPerTransaction: /* @__PURE__ */ AmountSchema.default(0),
  approvedCallTargets: /* @__PURE__ */ z.array(AddressOrEnsSchema),
});

export type AccessRestrictionsInput = z.input<typeof AccessRestrictionsSchema>;

export type SignerWithRestrictions = {
  signer: string;
  isAdmin: boolean;
  restrictions: AccessRestrictions;
};

export const SignerWithRestrictionsSchema = /* @__PURE__ */ z.object({
  signer: AddressOrEnsSchema,
  isAdmin: /* @__PURE__ */ z.boolean(),
  restrictions: AccessRestrictionsSchema,
});

export type SignerWithRestrictionsInput = z.input<
  typeof SignerWithRestrictionsSchema
>;

export const SignerWithRestrictionsBatchSchema = /* @__PURE__ */ z.array(
  SignerWithRestrictionsSchema,
);
export type SignerWithRestrictionsBatchInput = z.input<
  typeof SignerWithRestrictionsBatchSchema
>;

export type SignedAccountPermissionsPayload = {
  payload: IAccountPermissions.RoleRequestStruct;
  signature: BytesLike;
};

export enum RoleAction {
  GRANT = 0,
  REVOKE = 1,
}

export const RoleRequest = [
  { name: "role", type: "bytes32" },
  { name: "target", type: "address" },
  { name: "action", type: "uint8" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];
