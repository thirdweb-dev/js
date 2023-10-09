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
  const isLister = useIsLister(contract);
  if (!isLister) {
    return null;
  }
  return <>{children}</>;
};
