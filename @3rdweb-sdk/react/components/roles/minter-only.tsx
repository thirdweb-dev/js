import {
  isContractWithRoles,
  useIsAccountRole,
  useWeb3,
} from "@3rdweb-sdk/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";

interface IMinterOnlyProps {
  contract?: ValidContractInstance;
}

export const MinterOnly: React.FC<IMinterOnlyProps> = ({
  children,
  contract,
}) => {
  const { address } = useWeb3();

  const isMinter = useIsAccountRole(
    "minter",
    isContractWithRoles(contract) ? contract : undefined,
    address,
  );
  if (!isMinter) {
    return null;
  }
  return <>{children}</>;
};
