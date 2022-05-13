import {
  isContractWithRoles,
  useIsAccountRole,
  useWeb3,
} from "@3rdweb-sdk/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { ComponentWithChildren } from "types/component-with-children";

interface IListerOnlyProps {
  contract?: ValidContractInstance;
}

export const ListerOnly: ComponentWithChildren<IListerOnlyProps> = ({
  children,
  contract,
}) => {
  const { address } = useWeb3();

  const isLister = useIsAccountRole(
    "lister",
    isContractWithRoles(contract) ? contract : undefined,
    address,
  );

  if (!isLister) {
    return null;
  }

  return <>{children}</>;
};
