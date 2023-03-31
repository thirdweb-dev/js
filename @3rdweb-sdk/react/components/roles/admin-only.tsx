import {
  ContractWithRoles,
  useAddress,
  useIsAddressRole,
} from "@thirdweb-dev/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk/evm";
import { ComponentWithChildren } from "types/component-with-children";

interface AdminOnlyProps {
  contract?: ValidContractInstance;
  fallback?: JSX.Element;
}

export const AdminOnly: ComponentWithChildren<AdminOnlyProps> = ({
  children,
  contract,
  fallback,
}) => {
  const address = useAddress();
  const isAdmin = useIsAddressRole(
    contract as ContractWithRoles,
    "admin",
    address,
  );
  if (!isAdmin) {
    return fallback ?? null;
  }
  return <>{children}</>;
};

interface AdminOrSelfOnlyProps extends AdminOnlyProps {
  /**
   * The address of the account to check against
   */
  self: string;
}

export const AdminOrSelfOnly: ComponentWithChildren<AdminOrSelfOnlyProps> = ({
  children,
  self,
  fallback,
  contract,
}) => {
  const address = useAddress();
  const isAdmin = useIsAddressRole(
    contract as ContractWithRoles,
    "admin",
    address,
  );
  const isAdminOrSelf = isAdmin || self === address;

  if (!isAdminOrSelf) {
    return fallback ?? null;
  }
  return <>{children}</>;
};
