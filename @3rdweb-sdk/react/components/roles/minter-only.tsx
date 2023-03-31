import {
  ContractWithRoles,
  useAddress,
  useIsAddressRole,
} from "@thirdweb-dev/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk/evm";
import { ComponentWithChildren } from "types/component-with-children";

interface IMinterOnlyProps {
  contract?: ValidContractInstance;
}

export const MinterOnly: ComponentWithChildren<IMinterOnlyProps> = ({
  children,
  contract,
}) => {
  const address = useAddress();
  const isMinter = useIsAddressRole(
    contract as ContractWithRoles,
    "minter",
    address,
  );
  if (!isMinter) {
    return null;
  }
  return <>{children}</>;
};
