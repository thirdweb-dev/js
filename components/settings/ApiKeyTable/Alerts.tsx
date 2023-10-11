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

import { Heading, Text, TrackedLink } from "tw-components";

export const SecretHandlingAlert = () => {
  return (
    <Alert status="warning" variant="left-accent" borderRadius="md">
      <AlertIcon />
      <Flex direction="column" gap={2}>
        <Heading as={AlertTitle} size="label.md">
          Secret Key Handling
        </Heading>
        <Text as={AlertDescription} size="body.md">
          Store the Secret Key in a secure place and{" "}
          <strong>never share it</strong>. You will not be able to retrieve it
          again. If you lose it, you will need to create a new API Key pair.
        </Text>
      </Flex>
    </Alert>
  );
};

export const NoDomainsAlert = () => {
  return (
    <Alert status="error" variant="left-accent" borderRadius="md">
      <Flex direction="column" gap={1.5}>
        <Heading size="label.md" as={AlertTitle}>
          No Domains Configured
        </Heading>
        <Text size="body.sm" as={AlertDescription}>
          This will deny requests from all origins, rendering the key unusable
          in frontend applications. Proceed only if you intend to use this key
          in server environments.
        </Text>
      </Flex>
    </Alert>
  );
};

export const AnyDomainAlert = () => {
  return (
    <Alert status="warning" variant="left-accent" borderRadius="md">
      <Flex direction="column" gap={1.5}>
        <Heading size="label.md" as={AlertTitle}>
          Unrestricted Web Access
        </Heading>
        <Text size="body.sm" as={AlertDescription}>
          Requests from all origins will be authorized. If your key is leaked it
          could be misused.
        </Text>
      </Flex>
    </Alert>
  );
};

export const NoBundleIdsAlert = () => {
  return (
    <Alert status="error" variant="left-accent" borderRadius="md">
      <Flex direction="column" gap={1.5}>
        <Heading size="label.md" as={AlertTitle}>
          No Bundle IDs Configured
        </Heading>
        <Text size="body.sm" as={AlertDescription}>
          This will deny requests from all native applications, rendering the
          key unusable. Proceed only if you intend to use this key in server
          environments.
        </Text>
      </Flex>
    </Alert>
  );
};

export const AnyBundleIdAlert = () => {
  return (
    <Alert status="warning" variant="left-accent" borderRadius="md">
      <Flex direction="column" gap={1.5}>
        <Heading size="label.md" as={AlertTitle}>
          Unrestricted App Access
        </Heading>
        <Text size="body.sm" as={AlertDescription}>
          Requests from all applications will be authorized. If your key is
          leaked it could be misused.
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
    <Alert status="warning" variant="left-accent" borderRadius="md">
      <Flex direction="column" gap={1.5}>
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
