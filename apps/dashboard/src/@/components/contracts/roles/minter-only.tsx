import type { ThirdwebContract } from "thirdweb";
import { useIsMinter } from "@/hooks/useContractRoles";
import type { ComponentWithChildren } from "@/types/component-with-children";

interface IMinterOnlyProps {
  contract: ThirdwebContract;
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
