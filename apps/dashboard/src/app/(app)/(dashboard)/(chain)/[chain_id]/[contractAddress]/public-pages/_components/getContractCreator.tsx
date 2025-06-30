import type { ThirdwebContract } from "thirdweb";
import { isOwnerSupported, owner } from "thirdweb/extensions/common";
import {
  getRoleMember,
  isGetRoleAdminSupported,
} from "thirdweb/extensions/permissions";

export async function getContractCreator(
  contract: ThirdwebContract,
  functionSelectors: string[],
) {
  if (isOwnerSupported(functionSelectors)) {
    return owner({
      contract,
    });
  }

  if (isGetRoleAdminSupported(functionSelectors)) {
    return getRoleMember({
      contract,
      index: BigInt(0),
      role: "admin",
    });
  }

  return null;
}
