import type { IAccountPermissions } from "@thirdweb-dev/contracts-js";
import { BigNumber, BytesLike } from "ethers";
import { z } from "zod";
import { AmountSchema } from "../../core/schema/shared";
import { EndDateSchema, StartDateSchema } from "../schema";

export type AccountEvent = {
  account: string;
  admin: string;
};

export type AccessRestrictions = {
  startDate: Date;
  expirationDate: Date;
  nativeTokenLimitPerTransaction: BigNumber;
  approvedCallTargets: string[];
}

export const AccessRestrictionsZod = z.object({
  startDate: StartDateSchema,
  expirationDate: EndDateSchema,
  nativeTokenLimitPerTransaction: AmountSchema.default(0),
  approvedCallTargets: z.array(z.string()),
});

export type AccessRestrictionsInput = z.input<typeof AccessRestrictionsZod>;

export type AccessRestrictionsOutput = z.output<typeof AccessRestrictionsZod>;

export type SignerWithRestrictions = {
  signer: string;
  isAdmin: boolean;
  restrictions: AccessRestrictions;
}

export type SignedAccountPermissionsPayload = {
  payload: IAccountPermissions.RoleRequestStruct;
  signature: BytesLike;
}

export enum RoleAction { GRANT = 0, REVOKE = 1 }

export const RoleRequest = [
  { name: "role", type: "bytes32" },
  { name: "target", type: "address" },
  { name: "action", type: "uint8" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];