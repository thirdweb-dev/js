import { IContractActionButtonProps } from "./types";
import { Icon } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FaCoins } from "react-icons/fa";

export interface IDistributeButtonProps extends IContractActionButtonProps {
  distributeFunds: () => void;
  isLoading: boolean;
  transactions: number;
}

export const DistributeButton: React.FC<IDistributeButtonProps> = ({
  isLoading,
  transactions,
  distributeFunds,
  ...restButtonProps
}) => {
  return (
    <TransactionButton
      transactionCount={transactions}
      borderRadius="full"
      isLoading={isLoading}
      leftIcon={<Icon as={FaCoins} />}
      colorScheme="primary"
      onClick={distributeFunds}
      {...restButtonProps}
    >
      Distribute Funds
    </TransactionButton>
  );
};
