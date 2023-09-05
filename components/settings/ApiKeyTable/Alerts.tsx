import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";

import { Heading, LinkButton, Text } from "tw-components";

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

export const SmartWalletsAccessAlert = () => {
  const trackEvent = useTrack();
  const address = useAddress();

  const handleClick = () => {
    trackEvent({
      category: "api_keys",
      action: "bundler",
      label: "request_access",
      walletAddress: address,
    });
  };

  return (
    <Alert
      status="info"
      borderRadius="md"
      as={Flex}
      mb={4}
      justifyContent={{ base: "center", sm: "start" }}
      alignItems="center"
      flexDir={{ base: "column", sm: "row" }}
      gap={{ base: 3, sm: 0 }}
    >
      <AlertIcon />
      <AlertTitle textAlign={{ base: "center", sm: "left" }}>
        Smart Wallets service available on mainnet!
      </AlertTitle>
      <LinkButton
        minW={40}
        ml={2}
        isExternal
        onClick={handleClick}
        size="sm"
        href={`https://docs.google.com/forms/d/e/1FAIpQLSffFeEw7rPGYA8id7LwL22-W3irT6siXE5EHgD3xrxmxpLKCw/viewform?entry.948574526=${
          address || ""
        }`}
      >
        Request access
      </LinkButton>
    </Alert>
  );
};
