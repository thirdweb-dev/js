import { usePaymentsDetailedAnalytics } from "@3rdweb-sdk/react/hooks/usePayments";
import { Flex } from "@chakra-ui/react";

interface PaymentsAnalyticsProps {
  contractId: string;
}

export const PaymentsAnalytics: React.FC<PaymentsAnalyticsProps> = ({
  contractId,
}) => {
  usePaymentsDetailedAnalytics(contractId);

  return <Flex flexDir="column" gap={12}></Flex>;
};
