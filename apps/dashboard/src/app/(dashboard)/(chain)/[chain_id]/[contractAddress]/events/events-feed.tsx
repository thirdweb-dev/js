"use client";

import { CodeClient } from "@/components/ui/code/code.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import {
  type InternalTransaction,
  useActivity,
} from "@3rdweb-sdk/react/hooks/useActivity";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  LightMode,
  List,
  Select,
  SimpleGrid,
  Spinner,
  Switch,
  Tooltip,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useClipboard } from "hooks/useClipboard";
import { ChevronDownIcon, CircleHelpIcon, CopyIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { stringify } from "thirdweb/utils";
import { Button, Card, FormLabel, Heading, Text } from "tw-components";

interface EventsFeedProps {
  contract: ThirdwebContract;
}

export const EventsFeed: React.FC<EventsFeedProps> = ({ contract }) => {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const allEvents = useActivity(contract, autoUpdate);
  const searchParams = useSearchParams();
  const event = searchParams?.get("event");
  const [selectedEvent, setSelectedEvent] = useState(event || "all");
  const chainSlug = useChainSlug(contract.chain.id);
  const router = useDashboardRouter();

  const eventTypes = useMemo(
    () =>
      Array.from(
        new Set([
          ...allEvents.flatMap(({ events }) =>
            events.map(({ eventName }) => eventName),
          ),
        ]),
      ),
    [allEvents],
  );

  const filteredEvents = useMemo(
    () =>
      selectedEvent === "all"
        ? allEvents
        : allEvents.filter(({ events }) =>
            events.some(({ eventName }) => eventName === selectedEvent),
          ),
    [allEvents, selectedEvent],
  );

  return (
    <Flex gap={6} flexDirection="column">
      <Flex align="center" justify="space-between" w="full">
        <Flex gap={4} alignItems="center">
          <Heading flexShrink={0} size="title.sm">
            Latest Transactions
          </Heading>
          <Select
            w="50%"
            value={selectedEvent}
            onChange={(e) => {
              const val = e.target.value;
              if (eventTypes.includes(val)) {
                const path =
                  e.target.value === "all"
                    ? `/${chainSlug}/${contract.address}/events`
                    : `/${chainSlug}/${contract.address}/events?event=${val}`;
                router.push(path);
                setSelectedEvent(val);
              }
            }}
          >
            <option value="all">All</option>
            {eventTypes.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </Select>
        </Flex>
        <div>
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
        </div>
      </Flex>
      <Card p={0} overflow="hidden">
        <SimpleGrid
          gap={2}
          columns={12}
          borderBottomWidth="1px"
          borderColor="borderColor"
          padding={4}
          bg="blackAlpha.50"
          _dark={{ bg: "whiteAlpha.50" }}
        >
          <Heading gridColumn="span 4" size="label.md">
            Transaction Hash
          </Heading>
          <Heading gridColumn="span 5" size="label.md">
            Events
          </Heading>
          <Heading gridColumn="span 3" size="label.md">
            Block Number
          </Heading>
        </SimpleGrid>

        <List overflow="auto">
          {filteredEvents.length === 0 && (
            <div className="flex items-center justify-center py-4">
              <Flex align="center" gap={2}>
                {autoUpdate && <Spinner size="sm" speed="0.69s" />}
                <Text size="body.md" fontStyle="italic">
                  {autoUpdate ? "listening for events" : "no events to show"}
                </Text>
              </Flex>
            </div>
          )}
          <Accordion
            as={AnimatePresence}
            initial={false}
            allowMultiple
            defaultIndex={[]}
          >
            {filteredEvents?.slice(0, 10).map((e) => (
              <EventsFeedItem
                key={e.transactionHash}
                transaction={e}
                setSelectedEvent={setSelectedEvent}
                contractAddress={contract.address}
                chainSlug={chainSlug}
              />
            ))}
          </Accordion>
        </List>
      </Card>
    </Flex>
  );
};

interface EventsFeedItemProps {
  transaction: InternalTransaction;
  setSelectedEvent: React.Dispatch<React.SetStateAction<string>>;
  contractAddress: string;
  chainSlug: string | number;
}

const EventsFeedItem: React.FC<EventsFeedItemProps> = ({
  transaction,
  setSelectedEvent,
  contractAddress,
  chainSlug,
}) => {
  const { onCopy } = useClipboard(transaction.transactionHash);

  const router = useDashboardRouter();

  return (
    <AccordionItem
      borderBottom="none"
      borderColor="borderColor"
      _first={{ borderTop: "none" }}
    >
      <AccordionButton padding={0}>
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
          padding={4}
          overflow="hidden"
          alignItems="center"
          _last={{ borderBottomWidth: 0 }}
        >
          <Box gridColumn="span 3">
            <div className="flex flex-row items-center gap-3">
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
                    toast.info("Transaction hash copied.");
                  }}
                >
                  <CopyIcon className="size-4" />
                </Button>
              </Tooltip>
              <Text fontFamily="mono" noOfLines={1}>
                {transaction.transactionHash.slice(0, 32)}...
              </Text>
            </div>
          </Box>

          <Box gridColumn="span 1" />

          <ButtonGroup
            size="sm"
            variant="outline"
            gridColumn="span 5"
            flexWrap="wrap"
            gap={2}
            spacing={0}
          >
            {transaction.events.slice(0, 2).map((e, idx) => (
              <Button
                as="span"
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                key={idx}
                onClick={(ev) => {
                  ev.stopPropagation();
                  router.push(
                    `/${chainSlug}/${contractAddress}/events?event=${e.eventName}`,
                  );
                  setSelectedEvent(e.eventName);
                }}
              >
                {e.eventName}
              </Button>
            ))}
            {transaction.events.length > 2 && (
              <Button as="span" pointerEvents="none">
                + {transaction.events.length - 2}
              </Button>
            )}
          </ButtonGroup>

          <Box gridColumn="span 3">
            <div className="flex flex-row justify-between gap-2">
              <Text fontFamily="mono" noOfLines={1}>
                {transaction.blockNumber}
              </Text>
              <div>
                <ChevronDownIcon className="size-4" />
              </div>
            </div>
          </Box>
        </SimpleGrid>
      </AccordionButton>
      <AccordionPanel>
        <Card>
          <div className="flex flex-col gap-4">
            <Heading size="subtitle.sm" fontWeight="bold">
              Transaction Data
            </Heading>

            <Divider />

            <TransactionData
              name="Transaction Hash"
              value={transaction.transactionHash}
              description={`
                  A transaction hash is a unique 66 character identifier
                  that is generated whenever a transaction is executed.
                `}
            />

            <TransactionData
              name="Block Number"
              value={transaction.blockNumber}
              description={`
                  The number of the block in which the transaction was recorded.
                  Block confirmation indicate how many blocks since the transaction was validated.
                `}
            />

            <Heading size="subtitle.sm" fontWeight="bold" pt={6}>
              Event Data
            </Heading>

            <Divider />

            {transaction.events.map((event, idx, arr) => (
              <Fragment
                key={`${transaction.transactionHash}_${event.logIndex}`}
              >
                <SimpleGrid columns={12} gap={2}>
                  <Box gridColumn="span 3">
                    <Text fontWeight="bold">{event.eventName}</Text>
                  </Box>
                  <Box gridColumn="span 9">
                    <CodeClient
                      code={stringify(event.args, null, 2)}
                      lang="json"
                    />
                  </Box>
                </SimpleGrid>

                {arr.length - 1 === idx ? null : <Divider />}
              </Fragment>
            ))}
          </div>
        </Card>
      </AccordionPanel>
    </AccordionItem>
  );
};

interface TransactionDataProps {
  name: string;
  value: bigint | string;
  description: string;
}

const TransactionData: React.FC<TransactionDataProps> = ({
  name,
  value,
  description,
}) => {
  return (
    <>
      <SimpleGrid columns={12} gap={2}>
        <div className="col-span-3 flex flex-row items-center gap-2">
          <Tooltip
            p={0}
            bg="transparent"
            boxShadow="none"
            label={
              <Card py={2} px={4} bgColor="backgroundHighlight">
                <Text size="label.sm">{description}</Text>
              </Card>
            }
          >
            <div className="flex items-center justify-center">
              <CircleHelpIcon className="size-4 text-gray-600" />
            </div>
          </Tooltip>

          <Text fontWeight="bold">{name}</Text>
        </div>

        <Text gridColumn="span 9">{value.toString()}</Text>
      </SimpleGrid>
      <Divider />
    </>
  );
};
