import { Flex } from "@chakra-ui/react";

interface PaymentsWebhooksProps {
  accountId: string;
}

export const PaymentsWebhooks: React.FC<PaymentsWebhooksProps> = ({
  accountId,
}) => {
  return <Flex flexDir="column" gap={8}></Flex>;
};
