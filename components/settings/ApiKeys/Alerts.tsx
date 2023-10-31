import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { FiX } from "react-icons/fi";

import Message from "./message";

import { Heading, Text, TrackedLink } from "tw-components";

export const FieldAlert = ({
  message,
}: {
  message:
    | "NoDomains"
    | "AnyDomain"
    | "NoBundleIds"
    | "AnyBundleId"
    | "SecretKey";
}) => {
  return (
    <Alert status="warning" variant="left-accent">
      <Flex direction="column" gap={2}>
        <Heading as={AlertTitle} size="label.md">
          {(Message as any)[`${message}Title`]}
        </Heading>
        <Text as={AlertDescription} size="body.md">
          {(Message as any)[`${message}Description`]}
        </Text>
      </Flex>
    </Alert>
  );
};

export const NoTargetAddressesAlert = ({
  serviceName,
  serviceDesc,
}: {
  serviceName: string;
  serviceDesc: string;
}) => {
  return (
    <Alert status="warning" variant="left-accent">
      <Flex direction="column" gap={2}>
        <Heading size="label.md" as={AlertTitle}>
          No Contract Addresses Configured
        </Heading>
        <Text size="body.sm" as={AlertDescription}>
          Your key will not be able to use {serviceName} - {serviceDesc}. Either
          disable a service or specify allowed contract addresses.
        </Text>
      </Flex>
    </Alert>
  );
};

export const SmartWalletsBillingAlert = ({
  dismissable = false,
}: {
  dismissable?: boolean;
}) => {
  const [dismissed, setDismissed] = useLocalStorage(
    "dismissed-smart-wallets-billing-alert",
    false,
    true,
  );

  if (dismissable && dismissed) {
    return true;
  }

  return (
    <Alert
      status="warning"
      borderRadius="md"
      as={Flex}
      alignItems="start"
      justifyContent="space-between"
      mb={4}
      variant="left-accent"
      bg="backgroundCardHighlight"
    >
      <Flex>
        <AlertIcon boxSize={4} mt={1} ml={1} />
        <Flex flexDir="column" gap={1} pl={1}>
          <AlertTitle>Smart Wallets on Mainnet</AlertTitle>
          <AlertDescription>
            <Text as="span" pr={1}>
              You&apos;ve enabled Smart Wallets for one of your API keys and
              haven&apos;t added a payment method.
              <br />
              To use them on Mainnet,
            </Text>
            <TrackedLink
              href="/dashboard/settings/billing"
              category="api_keys"
              label="smart_wallets_missing_billing"
              fontWeight="medium"
              color="blue.500"
            >
              <Text as="span" color="blue.500">
                add a payment method.
              </Text>
            </TrackedLink>
          </AlertDescription>
        </Flex>
      </Flex>

      {dismissable && (
        <IconButton
          size="xs"
          aria-label="Close notice"
          icon={<FiX />}
          colorScheme="blackAlpha"
          color="white"
          variant="ghost"
          opacity={0.6}
          _hover={{ opacity: 1 }}
          onClick={() => setDismissed(true)}
        />
      )}
    </Alert>
  );
};
