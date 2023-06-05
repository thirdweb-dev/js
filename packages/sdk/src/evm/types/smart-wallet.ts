import { BigNumber } from "ethers";

export type AccountEvent = {
  account: string;
  admin: string;
};

export type AccessRestrictions = {
  startTimestamp: Date;
  expirationTimestamp: Date;
  maxValuePerTransaction: BigNumber;
  approvedTargets: string[];
}

export const RoleRequest = [
  { name: "role", type: "bytes32" },
  { name: "target", type: "string" },
  { name: "action", type: "uint8" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];