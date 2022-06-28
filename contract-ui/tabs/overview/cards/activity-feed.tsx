import {
  Box,
  ButtonGroup,
  Flex,
  FormControl,
  LightMode,
  List,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Switch,
} from "@chakra-ui/react";
import { useAllContractEvents, useContract } from "@thirdweb-dev/react";
import { ContractEvent } from "@thirdweb-dev/sdk";
import { bigNumberReplacer } from "components/app-layouts/providers";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CodeBlock,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import { isBrowser } from "utils/isBrowser";

interface ContractTransaction {
  transactionHash: ContractEvent["transaction"]["transactionHash"];
  blockNumber: ContractEvent["transaction"]["blockNumber"];
  events: ContractEvent[];
}

interface ActivityFeedProps {
  contractAddress?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  contractAddress,
}) => {
  const [autoUpdate, setAutoUpdate] = useState(isBrowser() ? true : false);

  const contractQuery = useContract(contractAddress);

  const eventsQuery = useAllContractEvents(contractQuery.contract, {
    subscribe: autoUpdate,
  });

  const transactions: ContractTransaction[] = useMemo(() => {
    if (!eventsQuery.data) {
      return [];
    }
    const obj = eventsQuery.data.slice(0, 100).reduce((acc, curr) => {
      if (acc[curr.transaction.transactionHash]) {
        acc[curr.transaction.transactionHash].events.push(curr);
        acc[curr.transaction.transactionHash].events.sort(
          (a, b) => b.transaction.logIndex - a.transaction.logIndex,
        );
        if (
          acc[curr.transaction.transactionHash].blockNumber >
          curr.transaction.blockNumber
        ) {
          acc[curr.transaction.transactionHash].blockNumber =
            curr.transaction.blockNumber;
        }
      } else {
        acc[curr.transaction.transactionHash] = {
          transactionHash: curr.transaction.transactionHash,
          blockNumber: curr.transaction.blockNumber,
          events: [curr],
        };
      }

      return acc;
    }, {} as Record<string, ContractTransaction>);

    return Object.values(obj).sort((a, b) => b.blockNumber - a.blockNumber);
  }, [eventsQuery.data]);
  return (
    <Flex gap={3} flexDirection="column">
      <Flex align="center" justify="space-between" w="full">
        <Heading size="subtitle.md">
          Activity Feed <small>(last 10 transactions)</small>
        </Heading>
        <Box>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="auto-update" mb="0">
              Auto-Update
            </FormLabel>
            <LightMode>
              <Switch
                isChecked={autoUpdate}
                onChange={() => setAutoUpdate((val) => !val)}
                id="auto-update"
              />
            </LightMode>
          </FormControl>
        </Box>
      </Flex>
      {eventsQuery.data && contractAddress && (
        <Card p={0} overflow="hidden">
          <SimpleGrid
            gap={2}
            columns={12}
            borderBottomWidth="1px"
            borderColor="borderColor"
            p={5}
            bg="blackAlpha.50"
            _dark={{ bg: "whiteAlpha.50" }}
          >
            <Heading gridColumn="span 9" size="label.md">
              Events
            </Heading>
            <Heading gridColumn="span 3" size="label.md">
              Transaction
            </Heading>
          </SimpleGrid>

          <List overflow="auto" maxH={{ base: "300px", md: "600px" }}>
            <AnimatePresence initial={false}>
              {transactions.slice(0, 10).map((e) => (
                <ActivityFeedItem key={e.transactionHash} transaction={e} />
              ))}
            </AnimatePresence>
          </List>
        </Card>
      )}
    </Flex>
  );
};

interface ActivityFeedItemProps {
  transaction: ContractTransaction;
}

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({
  transaction,
}) => {
  return (
    <SimpleGrid
      columns={12}
      gap={2}
      as={motion.li}
      initial={{
        y: -30,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        height: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
        height: "auto",
        paddingTop: "var(--chakra-space-3)",
        paddingBottom: "var(--chakra-space-3)",
        transition: { duration: 0.15 },
      }}
      exit={{
        y: 30,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        height: 0,
        transition: { duration: 0.3 },
      }}
      willChange="opacity, height, paddingTop, paddingBottom"
      borderBottomWidth="1px"
      borderColor="borderColor"
      px={5}
      overflow="hidden"
      alignItems="center"
      _last={{ borderBottomWidth: 0 }}
    >
      <ButtonGroup
        size="sm"
        variant="outline"
        gridColumn="span 9"
        flexWrap="wrap"
        gap={2}
        spacing={0}
      >
        {transaction.events.map((e) => (
          <Popover key={e.transaction.logIndex} isLazy placement="top">
            <PopoverTrigger>
              <Button>{e.eventName}</Button>
            </PopoverTrigger>
            <Card
              p={1}
              w="auto"
              as={PopoverContent}
              bg="backgroundCardHighlight"
              mx={6}
              boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
            >
              <PopoverArrow bg="backgroundCardHighlight" />
              <PopoverBody p={0}>
                <CodeBlock
                  code={JSON.stringify(e.data, bigNumberReplacer, 2)}
                  language="json"
                />
              </PopoverBody>
            </Card>
          </Popover>
        ))}
      </ButtonGroup>

      <Box gridColumn="span 3">
        <Text fontFamily="mono" noOfLines={1}>
          {transaction.transactionHash}
        </Text>
      </Box>
    </SimpleGrid>
  );
};
