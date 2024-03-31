export type AccountPermissions = {
  approvedTargets: string[] | "*";
  nativeTokenLimitPerTransaction?: number | string;
  permissionStartTimestamp?: Date;
  permissionEndTimestamp?: Date;
  reqValidityStartTimestamp?: Date;
  reqValidityEndTimestamp?: Date;
};

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
