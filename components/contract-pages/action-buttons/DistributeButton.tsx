import { IContractActionButtonProps } from "./types";
import {
  useDistributeNumOfTransactions,
  useSplitDistributeFunds,
} from "@3rdweb-sdk/react/hooks/useSplit";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useSingleQueryParam } from "hooks/useQueryParam";

export interface IDistributeButtonProps extends IContractActionButtonProps {}

export const DistributeButton: React.FC<IDistributeButtonProps> = ({
  ...restButtonProps
}) => {
  const splitsAddress = useSingleQueryParam("split");

  const numTransactions = useDistributeNumOfTransactions(splitsAddress);
  const distibutedFundsMutation = useSplitDistributeFunds(splitsAddress);

  if (!numTransactions) {
    return null;
  }

  return (
    <TransactionButton
      transactionCount={numTransactions}
      borderRadius="full"
      isLoading={distibutedFundsMutation.isLoading}
      colorScheme="primary"
      onClick={() => distibutedFundsMutation.mutate()}
      {...restButtonProps}
    >
      Distribute Funds
    </TransactionButton>
  );
};
