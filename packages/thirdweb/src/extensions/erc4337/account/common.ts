import { ADDRESS_ZERO } from "../../../constants/addresses.js";
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
      name: "Account",
      version: "1",
      verifyingContract: contract.address,
      chainId: contract.chain.id,
    },
    primaryType: "SignerPermissionRequest",
    types: { SignerPermissionRequest },
    message: req,
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
        ? [ADDRESS_ZERO]
        : permissions.approvedTargets,
    nativeTokenLimitPerTransaction: toWei(
      permissions.nativeTokenLimitPerTransaction?.toString() || "0",
    ),
    permissionStartTimestamp: dateToSeconds(
      permissions.permissionStartTimestamp || new Date(0),
    ),
    permissionEndTimestamp: dateToSeconds(
      permissions.permissionEndTimestamp || tenYearsFromNow(),
    ),
    reqValidityStartTimestamp: 0n,
    reqValidityEndTimestamp: dateToSeconds(tenYearsFromNow()),
    uid: await randomBytesHex(),
    isAdmin: 0, // session key flag
    signer: target,
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
    nativeTokenLimitPerTransaction: 0n,
    permissionStartTimestamp: 0n,
    permissionEndTimestamp: 0n,
    reqValidityStartTimestamp: 0n,
    reqValidityEndTimestamp: dateToSeconds(tenYearsFromNow()),
    uid: await randomBytesHex(),
    isAdmin: action === "add-admin" ? 1 : action === "remove-admin" ? 2 : 0,
    signer: target,
  };
}
