import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { setPermissionsForSigner } from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { signPermissionRequest, toContractPermissions } from "./common.js";
import { type AccountPermissions } from "./types.js";

export type AddSessionKeyOptions = {
  account: Account;
  sessionKeyAddress: string;
  permissions: AccountPermissions;
};

export async function addSessionKey(
  options: BaseTransactionOptions<AddSessionKeyOptions>,
) {
  const { contract, sessionKeyAddress, account, permissions } = options;
  return setPermissionsForSigner({
    contract,
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await toContractPermissions({
          target: sessionKeyAddress,
          permissions,
        }),
      });
      return { signature, req };
    },
  });
}
