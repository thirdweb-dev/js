import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { setPermissionsForSigner } from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { signPermissionRequest, toContractPermissions } from "./common.js";

export type RemoveSessionKeyOptions = {
  account: Account;
  sessionKeyAddress: string;
};

export async function removeSessionKey(
  options: BaseTransactionOptions<RemoveSessionKeyOptions>,
) {
  const { contract, account, sessionKeyAddress } = options;
  return setPermissionsForSigner({
    contract,
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await toContractPermissions({
          target: sessionKeyAddress,
          permissions: {
            approvedTargets: [],
            nativeTokenLimitPerTransaction: 0,
            permissionStartTimestamp: new Date(0),
            permissionEndTimestamp: new Date(0),
          },
        }),
      });
      return { signature, req };
    },
  });
}
