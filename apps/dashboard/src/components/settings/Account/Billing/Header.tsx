import { Badge } from "@/components/ui/badge";
import { Flex } from "@chakra-ui/react";
import { AlertCircleIcon, CheckCircleIcon, InfoIcon } from "lucide-react";
import { Text } from "tw-components";

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

        <Badge className="capitalize" variant="outline">
          <span className="flex flex-row items-center gap-2">
            <Icon
              validPayment={validPayment}
              paymentVerification={paymentVerification}
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

function Icon(props: {
  validPayment: boolean;
  paymentVerification: boolean;
}) {
  if (props.validPayment) {
    return <CheckCircleIcon className="size-4 text-success-text" />;
  }
  if (props.paymentVerification) {
    return <InfoIcon className="size-4 text-warning-text" />;
  }
  return <AlertCircleIcon className="size-4 text-error-text" />;
}
