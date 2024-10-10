import { Flex, Icon } from "@chakra-ui/react";
import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { Badge, Text } from "tw-components";

interface BillingHeaderProps {
  validPayment: boolean;
  paymentVerification: boolean;
}

export const BillingHeader: React.FC<BillingHeaderProps> = ({
  validPayment,
  paymentVerification,
}) => {
  return (
    <Flex direction="column" gap={1}>
      <h1 className="font-semibold text-xl tracking-tight">Billing Info</h1>

      <div className="flex flex-row items-center gap-2">
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
          <span className="flex flex-row items-center gap-2">
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
