/* import { usePaymentsTransactions } from "@3rdweb-sdk/react/hooks/usePayments"; */
import { Flex } from "@chakra-ui/react";

interface PaymentsTransactionsProps {
  contractId: string;
}

export const PaymentsTransactions: React.FC<PaymentsTransactionsProps> = ({
  contractId,
}) => {
  /* const { data: transactions } = usePaymentsTransactions(contractId); */

  /* console.log({ transactions }); */
  return <Flex flexDir="column" gap={12}></Flex>;
};
