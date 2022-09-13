import { useIsLister } from "@3rdweb-sdk/react/hooks/useContractRoles";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { ComponentWithChildren } from "types/component-with-children";

interface IListerOnlyProps {
  contract?: ValidContractInstance;
}

export const ListerOnly: ComponentWithChildren<IListerOnlyProps> = ({
  children,
  contract,
}) => {
  const isMinter = useIsLister(contract);
  if (!isMinter) {
    return null;
  }
  return <>{children}</>;
};
