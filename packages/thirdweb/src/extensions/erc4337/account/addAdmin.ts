import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { setPermissionsForSigner } from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { defaultPermissionsForAdmin, signPermissionRequest } from "./common.js";

export type AddAdminOptions = {
  account: Account;
  adminAddress: string;
};

export async function addAdmin(
  options: BaseTransactionOptions<AddAdminOptions>,
) {
  const { contract, account, adminAddress } = options;
  return setPermissionsForSigner({
    contract,
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await defaultPermissionsForAdmin({
          target: adminAddress,
          action: "add-admin",
        }),
      });
      return { signature, req };
    },
  });
}
