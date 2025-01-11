"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { XIcon } from "lucide-react";
import { Text, TrackedLink } from "tw-components";

export const SmartWalletsBillingAlert = ({
  dismissible = false,
}: {
  dismissible?: boolean;
}) => {
  const [dismissed, setDismissed] = useLocalStorage(
    "dismissed-smart-wallets-billing-alert",
    false,
    true,
  );

  if (dismissible && dismissed) {
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
      <div className="flex flex-row">
        <AlertIcon boxSize={4} mt={1} ml={1} />
        <Flex flexDir="column" gap={1} pl={1}>
          <AlertTitle>Account Abstraction on Mainnet</AlertTitle>
          <AlertDescription>
            <Text as="span" pr={1}>
              You&apos;ve enabled Account Abstraction for one of your API keys
              and haven&apos;t added a payment method.
              <br />
              To use them on Mainnet,
            </Text>
            <TrackedLink
              href="/team/~/~/settings/billing"
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
      </div>

      {dismissible && (
        <IconButton
          size="xs"
          aria-label="Close notice"
          icon={<XIcon className="size-4" />}
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
