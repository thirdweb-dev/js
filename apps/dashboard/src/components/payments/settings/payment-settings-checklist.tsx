import { usePaymentsSellerById } from "@3rdweb-sdk/react/hooks/usePayments";
import { Alert, AlertDescription, AlertIcon, Flex } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

interface PaymentsSettingsChecklistProps {
  paymentsSellerId: string;
}

export const PaymentsSettingsChecklist: React.FC<
  PaymentsSettingsChecklistProps
> = ({ paymentsSellerId }) => {
  const { data: sellerData } = usePaymentsSellerById(paymentsSellerId);

  if (!sellerData?.id || sellerData?.has_production_access) {
    return null;
  }

  return (
    <Alert
      status="error"
      borderRadius="lg"
      backgroundColor="backgroundCardHighlight"
      borderLeftColor="red.500"
      borderLeftWidth={4}
      as={Flex}
      gap={1}
    >
      <AlertIcon />
      <Flex flexDir="column">
        <AlertDescription as={Flex} flexDir="column" gap={4}>
          <Heading size="title.xs">
            Currently not accepting new seller profiles.
          </Heading>
          <Text>New seller profiles will not be verified.</Text>
        </AlertDescription>
      </Flex>
    </Alert>
  );
};
