import {
  type BaseTransactionOptions,
  encode,
  getAddress,
  type Hex,
  type ThirdwebContract,
} from "thirdweb";
import { multicall } from "thirdweb/extensions/common";
import { resolveAddress } from "thirdweb/extensions/ens";
import * as PermissionsExt from "thirdweb/extensions/permissions";
import type { Account } from "thirdweb/wallets";

export async function getAllRoleMembers(options: BaseTransactionOptions) {
  return Object.fromEntries(
    await Promise.all(
      Object.keys(PermissionsExt.roleMap).map(
        async (role) =>
          [
            role,
            await PermissionsExt.getAllRoleMembers({ ...options, role }).catch(
              () => [],
            ),
          ] as const,
      ),
    ),
  );
}

export function createSetAllRoleMembersTx(options: {
  account: Account;
  contract: ThirdwebContract;
  roleMemberMap: Awaited<ReturnType<typeof getAllRoleMembers>>;
}) {
  return multicall({
    asyncParams: async () => {
      const connectedWalletAddress = getAddress(options.account.address);
      // if we are removing multiple roles, we need to allways remove the connected wallet address *last*
      // this is so we don't renounce (i.e.)  admin role first and then try to revoke someone else's (i.e.) admin role after (which will revert the entire txn because we are no longer an admin)
      const roles = Object.keys(options.roleMemberMap);
      if (roles.length === 0) {
        throw new Error("No roles to set");
      }
      // get the current role members
      const currentRoles = await getAllRoleMembers(options);
      const encoded: Hex[] = [];
      // add / remove admin role at the end so we don't revoke admin then grant
      const sortedRoles = roles.sort((role) => (role === "admin" ? 1 : -1));
      for (let i = 0; i < sortedRoles.length; i++) {
        const role = sortedRoles[i];
        if (!role) {
          continue;
        }
        const [addresses, currentAddresses] = await Promise.all([
          Promise.all(
            options.roleMemberMap[role]?.map((addressOrEns) =>
              resolveAddress({
                client: options.contract.client,
                name: addressOrEns,
              }),
            ) || [],
          ),
          Promise.all(
            currentRoles[role]?.map((addressOrEns) =>
              resolveAddress({
                client: options.contract.client,
                name: addressOrEns,
              }),
            ) || [],
          ),
        ]);
        const toAdd = addresses.filter(
          (address) => !currentAddresses.includes(address),
        );
        const toRemove = currentAddresses.filter(
          (address) => !addresses.includes(address),
        );

        // if we're removing more than one address we have to make sure we always remove the *connected* (acting) wallet address first
        // otherwise we'll revoke the connected wallet address and then try to revoke someone else's address which will revert the entire txn
        if (toRemove.length > 1) {
          const index = toRemove.indexOf(connectedWalletAddress);
          if (index > -1) {
            toRemove.splice(index, 1);
            toRemove.push(connectedWalletAddress);
          }
        }
        if (toAdd.length) {
          const encodedToAdd = await Promise.all(
            toAdd.map((addr) =>
              encode(
                PermissionsExt.grantRole({
                  contract: options.contract,
                  role,
                  targetAccountAddress: addr,
                }),
              ),
            ),
          );
          encoded.push(...encodedToAdd);
        }
        if (toRemove.length) {
          const encodedToRemove = await Promise.all(
            toRemove.map((address) => {
              const tx =
                getAddress(address) === connectedWalletAddress
                  ? PermissionsExt.renounceRole({
                      contract: options.contract,
                      role,
                      targetAccountAddress: address,
                    })
                  : PermissionsExt.revokeRole({
                      contract: options.contract,
                      role,
                      targetAccountAddress: address,
                    });
              return encode(tx);
            }),
          );
          encoded.push(...encodedToRemove);
        }
      }
      return {
        data: encoded,
      };
    },
    contract: options.contract,
  });
}
