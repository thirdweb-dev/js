import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import { randomBytesHex } from "../../../utils/random.js";
import { toWei } from "../../../utils/units.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { SetPermissionsForSignerParams } from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { type AccountPermissions, SignerPermissionRequest } from "./types.js";

/**
 * @internal
 */
export async function signPermissionRequest(options: {
  account: Account;
  contract: ThirdwebContract;
  req: SetPermissionsForSignerParams["req"];
}) {
  const { account, contract, req } = options;
  const signature = await account.signTypedData({
    domain: {
      chainId: contract.chain.id,
      name: "Account",
      verifyingContract: contract.address,
      version: "1",
    },
    message: req,
    primaryType: "SignerPermissionRequest",
    types: { SignerPermissionRequest },
  });
  return { req, signature };
}

/**
 * @internal
 */
export async function toContractPermissions(options: {
  target: string;
  permissions: AccountPermissions;
}): Promise<SetPermissionsForSignerParams["req"]> {
  const { target, permissions } = options;
  return {
    approvedTargets:
      permissions.approvedTargets === "*"
        ? [ZERO_ADDRESS]
        : permissions.approvedTargets,
    isAdmin: 0,
    nativeTokenLimitPerTransaction: toWei(
      permissions.nativeTokenLimitPerTransaction?.toString() || "0",
    ),
    permissionEndTimestamp: dateToSeconds(
      permissions.permissionEndTimestamp || tenYearsFromNow(),
    ),
    permissionStartTimestamp: dateToSeconds(
      permissions.permissionStartTimestamp || new Date(0),
    ),
    reqValidityEndTimestamp: dateToSeconds(tenYearsFromNow()),
    reqValidityStartTimestamp: 0n,
    signer: target, // session key flag
    uid: await randomBytesHex(),
  };
}

/**
 * @internal
 */
export async function defaultPermissionsForAdmin(options: {
  target: string;
  action: "add-admin" | "remove-admin";
}): Promise<SetPermissionsForSignerParams["req"]> {
  const { target, action } = options;
  return {
    approvedTargets: [],
    isAdmin: action === "add-admin" ? 1 : action === "remove-admin" ? 2 : 0,
    nativeTokenLimitPerTransaction: 0n,
    permissionEndTimestamp: 0n,
    permissionStartTimestamp: 0n,
    reqValidityEndTimestamp: dateToSeconds(tenYearsFromNow()),
    reqValidityStartTimestamp: 0n,
    signer: target,
    uid: await randomBytesHex(),
  };
}
