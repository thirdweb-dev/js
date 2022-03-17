import { IContractActionButtonProps } from "./types";
import { Icon } from "@chakra-ui/react";
import { Button } from "components/buttons/Button";
import { FaCoins } from "react-icons/fa";

export interface IDistributeButtonProps extends IContractActionButtonProps {
  distributeFunds: () => void;
  isLoading: boolean;
}

export const DistributeButton: React.FC<IDistributeButtonProps> = ({
  isLoading,
  distributeFunds,
  ...restButtonProps
}) => {
  return (
    <Button
      isLoading={isLoading}
      leftIcon={<Icon as={FaCoins} />}
      colorScheme="primary"
      onClick={distributeFunds}
      {...restButtonProps}
    >
      Distribute Funds
    </Button>
  );
};
