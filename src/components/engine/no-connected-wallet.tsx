import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  Divider,
  Flex,
  Icon,
  ListItem,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { VscBook } from "react-icons/vsc";
import { Card, Heading, Link, Text } from "tw-components";

export const EngineNoConnectedWallet: React.FC = () => {
  return (
    <Stack spacing={8}>
      <ChakraNextImage
        alt="Engine hero image"
        src={require("../../../public/assets/engine/empty-state-header.png")}
        maxW={650}
      />
      <Heading size="title.lg" as="h1">
        Your scalable web3 backend server
      </Heading>

      <UnorderedList color="gray.600">
        <ListItem>
          Read, write, and deploy contracts at production scale
        </ListItem>
        <ListItem>
          Reliably parallelize and retry transactions with gas &amp; nonce
          management
        </ListItem>
        <ListItem>Securely manage backend wallets</ListItem>
        <ListItem>
          Built-in support for account abstraction, relayers, and more
        </ListItem>
      </UnorderedList>

      <Flex h="fit-content">
        <CustomConnectWallet />
      </Flex>

      <Divider />

      <Card p={8}>
        <Stack>
          <Flex gap={2} align="center">
            <Icon as={VscBook} />
            <Heading size="title.xs">Learn more about Engine</Heading>
          </Flex>
          <Text>Dive into features and integration guides.</Text>
          <Link
            href="https://portal.thirdweb.com/engine"
            isExternal
            color="blue.500"
            fontSize="small"
          >
            View Docs &rarr;
          </Link>
        </Stack>
      </Card>
    </Stack>
  );
};
