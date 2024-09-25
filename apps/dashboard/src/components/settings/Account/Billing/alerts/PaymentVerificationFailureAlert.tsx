import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";
import { getBillingPaymentMethodVerificationFailureResponse } from "lib/billing";
import { Heading, Text, TrackedLinkButton } from "tw-components";

type PaymentVerificationFailureAlertProps = {
  onDismiss?: () => void;
  paymentFailureCode: string;
};

export const PaymentVerificationFailureAlert: React.FC<
  PaymentVerificationFailureAlertProps
> = ({ paymentFailureCode = "generic_decline" }) => {
  const { title, reason, resolution } =
    getBillingPaymentMethodVerificationFailureResponse({ paymentFailureCode });

  return (
    <Alert
      status="error"
      borderRadius="md"
      as={Flex}
      alignItems="start"
      justifyContent="space-between"
      variant="left-accent"
      bg="inputBg"
    >
      <div className="flex flex-row">
        <AlertIcon boxSize={4} mt={1} ml={1} />
        <Flex flexDir="column" pl={1}>
          <AlertTitle>
            <Heading as="span" size="subtitle.sm">
              ERROR: {title}
            </Heading>
          </AlertTitle>
          <AlertDescription mb={2} as={Flex} direction="column">
            <Text>
              {reason ? `${reason}. ` : ""}
              {resolution ? `${resolution}.` : ""}
            </Text>
            <Flex mt="4">
              <TrackedLinkButton
                variant="link"
                href="/support"
                category="billing"
                label="support"
                color="blue.500"
                fontSize="small"
                isExternal
              >
                Contact Support
              </TrackedLinkButton>
            </Flex>
          </AlertDescription>
        </Flex>
      </div>
    </Alert>
  );
};
