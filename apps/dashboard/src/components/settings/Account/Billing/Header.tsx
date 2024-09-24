import { Flex, Icon } from "@chakra-ui/react";
import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { Badge, Heading, Text } from "tw-components";

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

      <div className="flex flex-row">
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
          <span className="flex flex-row">
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
          </span>
        </Badge>
      </div>
    </Flex>
  );
};
