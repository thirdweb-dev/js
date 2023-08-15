import {
  Alert,
  Flex,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { Text, TrackedLink } from "tw-components";

export const AccountsNotice = () => {
  return (
    <Alert
      status="info"
      borderRadius="md"
      as={Flex}
      flexDir="column"
      alignItems="start"
      gap={2}
      mb={4}
    >
      <Flex justifyContent="start">
        <AlertIcon />
        <AlertTitle>Welcome to your own account factory contract</AlertTitle>
      </Flex>
      <AlertDescription>
        <Flex flexDir="column" gap={2}>
          <AlertDescription>
            This contract is not meant to be interacted directly, instead its
            meant to be integrating in your application using the{" "}
            <TrackedLink
              isExternal
              href="https://portal.thirdweb.com/wallet/smart-wallet"
              category="accounts-page"
              label="wallet-sdk"
              color="primary.500"
            >
              Wallet SDK
            </TrackedLink>
            . As your application deploys account contracts, they will appear
            here.
          </AlertDescription>
          <Text>Once setup, your application will:</Text>
          <UnorderedList>
            <Text as={ListItem}>Let users connect to their smart wallet.</Text>
            <Text as={ListItem}>
              Automatically deploy the individual account contracts for your
              users when they do their first onchain transaction.
            </Text>
          </UnorderedList>
          <Text>
            The combination of the SDK and this contract has important benefits
            for your apps:
          </Text>
          <UnorderedList>
            <Text as={ListItem}>
              Every connected user will get a stable, predictable account
              address.
            </Text>
            <Text as={ListItem}>
              This means you can airdrop tokens, NFTs and ETH to the predicted
              addresses safely.
            </Text>
            <Text as={ListItem}>
              The account contract only gets deployed when a user performs its
              first transaction, saving on gas costs for inactive users.
            </Text>
          </UnorderedList>
        </Flex>
      </AlertDescription>
    </Alert>
  );
};
