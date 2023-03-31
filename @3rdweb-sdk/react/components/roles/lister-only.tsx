import {
  ContractWithRoles,
  useAddress,
  useIsAddressRole,
} from "@thirdweb-dev/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk/evm";
import { ComponentWithChildren } from "types/component-with-children";

interface IListerOnlyProps {
  contract?: ValidContractInstance;
}

export const ListerOnly: ComponentWithChildren<IListerOnlyProps> = ({
  children,
  contract,
}) => {
  const address = useAddress();
  const isLister = useIsAddressRole(
    contract as ContractWithRoles,
    "minter",
    address,
  );
  if (!isLister) {
    return null;
  }
  return <>{children}</>;
};
