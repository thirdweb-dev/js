import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  IconButton,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { OnboardingModal } from "components/onboarding/Modal";
import { getRecurringPaymentFailureResponse } from "lib/billing";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Heading, Text, TrackedLinkButton } from "tw-components";
import { LazyOnboardingBilling } from "../../../../onboarding/LazyOnboardingBilling";
import { ManageBillingButton } from "../ManageButton";

type RecurringPaymentFailureAlertProps = {
  isServiceCutoff?: boolean;
  onDismiss?: () => void;
  affectedServices?: string[];
  paymentFailureCode: string;
};

export const RecurringPaymentFailureAlert: React.FC<
  RecurringPaymentFailureAlertProps
> = ({
  isServiceCutoff = false,
  onDismiss,
  affectedServices = [],
  paymentFailureCode = "bank_decline",
}) => {
  // TODO: We should find a way to move this deeper into the
  // TODO: ManageBillingButton component and set an optional field to override
  const [paymentMethodSaving, setPaymentMethodSaving] = useState(false);
  const meQuery = useAccount();
  const { data: account } = meQuery;

  const {
    onOpen: onPaymentMethodOpen,
    onClose: onPaymentMethodClose,
    isOpen: isPaymentMethodOpen,
  } = useDisclosure();

  const handlePaymentAdded = () => {
    setPaymentMethodSaving(true);
    onPaymentMethodClose();
  };

  const { title, reason, resolution } = getRecurringPaymentFailureResponse({
    paymentFailureCode,
  });

  const header = isServiceCutoff
    ? "You have lost access to some paid services"
    : title;

  return (
    <Alert
      status="error"
      borderRadius="md"
      as={Flex}
      alignItems="start"
      justifyContent="space-between"
      variant="left-accent"
      bg="backgroundCardHighlight"
    >
      <>
        <OnboardingModal
          isOpen={isPaymentMethodOpen}
          onClose={onPaymentMethodClose}
        >
          <LazyOnboardingBilling
            onSave={handlePaymentAdded}
            onCancel={onPaymentMethodClose}
          />
        </OnboardingModal>
      </>

      <Flex>
        <AlertIcon boxSize={4} mt={1} ml={1} />
        <Flex flexDir="column" pl={1}>
          <AlertTitle>
            <Heading as="span" size="subtitle.sm">
              {header}
            </Heading>
          </AlertTitle>
          <AlertDescription mt={4} mb={2}>
            <Flex direction={"column"} gap={4}>
              <Text>
                {reason ? `${reason}. ` : ""}
                {resolution ? `${resolution}. ` : ""}
                {isServiceCutoff
                  ? ""
                  : "We will retry several times over the next 10 days after your invoice date, after which you will lose access to your services."}
              </Text>
              {affectedServices.length > 0 && (
                <Flex direction="column">
                  <Text>Affected services:</Text>
                  <UnorderedList mb={4}>
                    {affectedServices.map((service) => (
                      <li key={service}>
                        <Text>{service}</Text>
                      </li>
                    ))}
                  </UnorderedList>
                </Flex>
              )}
              <Flex>
                {account && (
                  <ManageBillingButton
                    account={account}
                    loading={paymentMethodSaving}
                    loadingText="Verifying payment method"
                    buttonProps={{ colorScheme: "primary" }}
                    onClick={
                      [
                        AccountStatus.ValidPayment,
                        AccountStatus.InvalidPayment,
                      ].includes(account.status)
                        ? undefined
                        : onPaymentMethodOpen
                    }
                  />
                )}
                <TrackedLinkButton
                  ml="4"
                  variant="outline"
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
            </Flex>
          </AlertDescription>
        </Flex>
      </Flex>

      {onDismiss && (
        <IconButton
          size="xs"
          aria-label="Close announcement"
          icon={<FiX />}
          color="bgBlack"
          variant="ghost"
          opacity={0.6}
          _hover={{ opacity: 1 }}
          onClick={onDismiss}
        />
      )}
    </Alert>
  );
};
