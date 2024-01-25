import { Flex, HStack, Icon } from "@chakra-ui/react";
import { Heading, Text, Badge } from "tw-components";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

interface BillingHeaderProps {
  validPayment: boolean;
  paymentVerification: boolean;
}

export const BillingHeader: React.FC<BillingHeaderProps> = ({
  validPayment,
  paymentVerification,
}) => {
  return (
    <Flex direction="column" gap={2}>
      <Heading size="title.lg" as="h1">
        Billing Info
      </Heading>

      <HStack>
        <Text size="body.md">
          Manage your payment methods, billing information and invoices.
        </Text>

        <Badge
          borderRadius="md"
          size="label.sm"
          px={3}
          py={1.5}
          textTransform="capitalize"
        >
          <HStack as="span">
            <Icon
              as={
                validPayment
                  ? FiCheckCircle
                  : paymentVerification
                    ? FiInfo
                    : FiAlertCircle
              }
              color={
                validPayment
                  ? "green.500"
                  : paymentVerification
                    ? "orange.500"
                    : "red.500"
              }
            />
            <Text size="label.sm" as="span">
              {validPayment
                ? "Valid payment"
                : paymentVerification
                  ? "Needs verification"
                  : "Invalid payment"}
            </Text>
          </HStack>
        </Badge>
      </HStack>
    </Flex>
  );
};
