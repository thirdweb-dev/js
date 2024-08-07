import {
  useIsAdmin,
  useIsAdminOrSelf,
} from "@3rdweb-sdk/react/hooks/useContractRoles";
import type { ThirdwebContract } from "thirdweb";
import type { ComponentWithChildren } from "types/component-with-children";

interface AdminOnlyProps {
  contract: ThirdwebContract;
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

interface AdminOrSelfOnlyProps {
  contract: ThirdwebContract;
  fallback?: JSX.Element;
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
