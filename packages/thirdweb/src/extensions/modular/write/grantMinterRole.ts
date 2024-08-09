import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { grantRoles } from "../__generated__/ModularCore/write/grantRoles.js";

const MINTER_ROLE = 1n;

export type GrantMinterRoleParams = {
  user: AbiParameterToPrimitiveType<{
    name: "user";
    type: "address";
    internalType: "address";
  }>;
};

export function grantMinterRole(
  options: BaseTransactionOptions<GrantMinterRoleParams>,
) {
  return grantRoles({
    contract: options.contract,
    user: options.user,
    roles: MINTER_ROLE,
  });
}
