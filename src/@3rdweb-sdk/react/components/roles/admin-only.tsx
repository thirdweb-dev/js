import {
  useIsAdmin,
  useIsAdminOrSelf,
} from "@3rdweb-sdk/react/hooks/useContractRoles";
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
  const isAdmin = useIsAdmin(contract);
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
  const isAdminOrSelf = useIsAdminOrSelf(contract, self);

  if (!isAdminOrSelf) {
    return fallback ?? null;
  }
  return <>{children}</>;
};
