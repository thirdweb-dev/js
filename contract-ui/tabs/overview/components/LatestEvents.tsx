import { useActivity } from "@3rdweb-sdk/react/hooks/useActivity";
import {
  Box,
  ButtonGroup,
  Center,
  Flex,
  Icon,
  List,
  SimpleGrid,
  Spinner,
  Stack,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import type { ContractEvent } from "@thirdweb-dev/sdk";
import { useTabHref } from "contract-ui/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import {
  Button,
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedLink,
  TrackedLinkProps,
} from "tw-components";
import { shortenString } from "utils/usedapp-external";

interface ContractTransaction {
  transactionHash: ContractEvent["transaction"]["transactionHash"];
  blockNumber: ContractEvent["transaction"]["blockNumber"];
  events: ContractEvent[];
}

interface LatestEventsProps {
  trackingCategory: TrackedLinkProps["category"];
  address?: string;
}

export const LatestEvents: React.FC<LatestEventsProps> = ({
  address,
  trackingCategory,
}) => {
  const [autoUpdate] = useState(true);
  const eventsHref = useTabHref("events");

  const allEvents = useActivity(address, autoUpdate);

  return (
    <Flex gap={6} flexDirection="column">
      <Flex align="center" justify="space-between" w="full">
        <Heading flexShrink={0} size="title.sm">
          Latest Events
        </Heading>
        <TrackedLink
          category={trackingCategory}
          label="view_all_events"
          color="blue.400"
          _light={{
            color: "blue.600",
          }}
          gap={4}
          href={eventsHref}
        >
          View all -&gt;
        </TrackedLink>
      </Flex>
      {address && (
        <Card p={0} overflow="hidden">
          <SimpleGrid
            gap={2}
            columns={9}
            borderBottomWidth="1px"
            borderColor="borderColor"
            padding={4}
            bg="blackAlpha.50"
            _dark={{ bg: "whiteAlpha.50" }}
          >
            <Heading gridColumn="span 3" size="label.md">
              Transaction Hash
            </Heading>
            <Heading gridColumn="span 6" size="label.md">
              Events
            </Heading>
          </SimpleGrid>

          <List overflow="auto">
            {allEvents.length === 0 ? (
              <Center py={4}>
                <Flex align="center" gap={2}>
                  {autoUpdate && <Spinner size="sm" speed="0.69s" />}
                  <Text size="body.md" fontStyle="italic">
                    {autoUpdate ? "listening for events" : "no events to show"}
                  </Text>
                </Flex>
              </Center>
            ) : null}
            <AnimatePresence initial={false}>
              {allEvents
                ?.slice(0, 3)
                .map((e) => (
                  <EventsFeedItem key={e.transactionHash} transaction={e} />
                ))}
            </AnimatePresence>
          </List>
        </Card>
      )}
    </Flex>
  );
};

interface EventsFeedItemProps {
  transaction: ContractTransaction;
}

const EventsFeedItem: React.FC<EventsFeedItemProps> = ({
  transaction,
}) => {
  const toast = useToast();
  const { onCopy, setValue } = useClipboard(transaction.transactionHash);

  useEffect(() => {
    if (transaction.transactionHash) {
      setValue(transaction.transactionHash);
    }
  }, [transaction.transactionHash, setValue]);

  const href = useTabHref("events");

  return (
    <Box>
      <SimpleGrid
        columns={9}
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
        padding={4}
        overflow="hidden"
        alignItems="center"
        _last={{ borderBottomWidth: 0 }}
      >
        <Box gridColumn="span 3">
          <Stack direction="row" align="center" spacing={3}>
            <Tooltip
              p={0}
              bg="transparent"
              boxShadow="none"
              label={
                <Card py={2} px={4} bgColor="backgroundHighlight">
                  <Text size="label.sm">
                    Copy transaction hash to clipboard
                  </Text>
                </Card>
              }
            >
              <Button
                size="sm"
                bg="transparent"
                onClick={() => {
                  onCopy();
                  toast({
                    variant: "solid",
                    position: "bottom",
                    title: "Transaction hash copied.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                }}
              >
                <Icon as={FiCopy} boxSize={3} />
              </Button>
            </Tooltip>
            <Text fontFamily="mono" noOfLines={1}>
              {shortenString(transaction.transactionHash)}
            </Text>
          </Stack>
        </Box>

        <ButtonGroup
          size="sm"
          variant="outline"
          gridColumn="span 6"
          flexWrap="wrap"
          gap={2}
          spacing={0}
        >
          {transaction.events.slice(0, 2).map((e, idx) => (
            <LinkButton key={idx} href={`${href}?event=${e.eventName}`}>
              <Text color="whiteBg" fontWeight="600" isTruncated>
                {e.eventName}
              </Text>
            </LinkButton>
          ))}
          {transaction.events.length > 2 && (
            <Button as="span" pointerEvents="none">
              + {transaction.events.length - 2}
            </Button>
          )}
        </ButtonGroup>
      </SimpleGrid>
    </Box>
  );
};
