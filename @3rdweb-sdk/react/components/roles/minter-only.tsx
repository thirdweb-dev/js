import { useIsMinter } from "@3rdweb-sdk/react/hooks/useContractRoles";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { ComponentWithChildren } from "types/component-with-children";

interface IMinterOnlyProps {
  contract?: ValidContractInstance;
}

export const MinterOnly: ComponentWithChildren<IMinterOnlyProps> = ({
  children,
  contract,
}) => {
  const isMinter = useIsMinter(contract);
  if (!isMinter) {
    return null;
  }
  return <>{children}</>;
};
