import {
  isContractWithRoles,
  useIsAccountRole,
  useWeb3,
} from "@3rdweb-sdk/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";

interface IListerOnlyProps {
  contract?: ValidContractInstance;
}

export const ListerOnly: React.FC<IListerOnlyProps> = ({
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
