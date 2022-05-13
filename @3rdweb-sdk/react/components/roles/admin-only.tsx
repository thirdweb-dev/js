import {
  isContractWithRoles,
  useIsAccountRole,
  useWeb3,
} from "@3rdweb-sdk/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
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
  const { address } = useWeb3();

  const isAdmin = useIsAccountRole(
    "admin",
    isContractWithRoles(contract) ? contract : undefined,
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
  const { address } = useWeb3();

  const isAdmin = useIsAccountRole(
    "admin",
    isContractWithRoles(contract) ? contract : undefined,
    address,
  );
  if (!isAdmin && address !== self) {
    return fallback ?? null;
  }
  return <>{children}</>;
};
