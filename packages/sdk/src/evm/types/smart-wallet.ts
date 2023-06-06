import type { IAccountPermissions } from "@thirdweb-dev/contracts-js";
import { BigNumber, BytesLike } from "ethers";

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
  { name: "target", type: "string" },
  { name: "action", type: "uint8" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];