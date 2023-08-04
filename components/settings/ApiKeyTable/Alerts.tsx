import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";

import { Heading, Text } from "tw-components";

export const SecretHandlingAlert = () => {
  return (
    <Alert status="warning" variant="left-accent">
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
    <Alert status="error" variant="left-accent">
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
    <Alert status="warning" variant="left-accent">
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
    <Alert status="error" variant="left-accent">
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
    <Alert status="warning" variant="left-accent">
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
    <Alert status="warning" variant="left-accent">
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
