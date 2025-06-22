import type { JSX } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useIsAdmin, useIsAdminOrSelf } from "@/hooks/useContractRoles";
import type { ComponentWithChildren } from "@/types/component-with-children";

interface AdminOnlyProps {
  contract: ThirdwebContract;
  failOpen?: boolean;
  fallback?: JSX.Element;
}

export const AdminOnly: ComponentWithChildren<AdminOnlyProps> = ({
  children,
  contract,
  failOpen = true,
  fallback,
}) => {
  const isAdmin = useIsAdmin(contract, failOpen);
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
