import type { ThirdwebContract } from "thirdweb";
import { useIsLister } from "@/hooks/useContractRoles";
import type { ComponentWithChildren } from "@/types/component-with-children";

interface IListerOnlyProps {
  contract: ThirdwebContract;
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
