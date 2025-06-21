"use client";

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
import { useChainSlug } from "hooks/chains/chainSlug";
import { useClipboard } from "hooks/useClipboard";
import { ChevronDownIcon, CircleHelpIcon, CopyIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Fragment, useId, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { stringify } from "thirdweb/utils";
import { Button, Card, FormLabel, Heading, Text } from "tw-components";
import { CodeClient } from "@/components/ui/code/code.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../_utils/contract-page-path";

interface EventsFeedProps {
  contract: ThirdwebContract;
  projectMeta: ProjectMeta | undefined;
}

export const EventsFeed: React.FC<EventsFeedProps> = ({
  contract,
  projectMeta,
}) => {
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

  const autoUpdateId = useId();

  return (
    <Flex flexDirection="column" gap={6}>
      <Flex align="center" justify="space-between" w="full">
        <Flex alignItems="center" gap={4}>
          <Heading flexShrink={0} size="title.sm">
            Latest Transactions
          </Heading>
          <Select
            onChange={(e) => {
              const val = e.target.value;

              if (eventTypes.includes(val)) {
                const path = buildContractPagePath({
                  chainIdOrSlug: chainSlug.toString(),
                  contractAddress: contract.address,
                  projectMeta,
                  subpath:
                    e.target.value === "all"
                      ? "/events"
                      : `/events?event=${val}`,
                });

                router.push(path);
                setSelectedEvent(val);
              }
            }}
            value={selectedEvent}
            w="50%"
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
          <FormControl alignItems="center" display="flex">
            <FormLabel htmlFor={autoUpdateId} mb="0">
              Auto-Update
            </FormLabel>
            <LightMode>
              <Switch
                id={autoUpdateId}
                isChecked={autoUpdate}
                onChange={() => setAutoUpdate((val) => !val)}
              />
            </LightMode>
          </FormControl>
        </div>
      </Flex>
      <Card overflow="hidden" p={0}>
        <SimpleGrid
          _dark={{ bg: "whiteAlpha.50" }}
          bg="blackAlpha.50"
          borderBottomWidth="1px"
          borderColor="borderColor"
          columns={12}
          gap={2}
          padding={4}
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
                <Text fontStyle="italic" size="body.md">
                  {autoUpdate ? "listening for events" : "no events to show"}
                </Text>
              </Flex>
            </div>
          )}
          <Accordion allowMultiple defaultIndex={[]}>
            {filteredEvents?.slice(0, 10).map((e) => (
              <EventsFeedItem
                chainSlug={chainSlug}
                contractAddress={contract.address}
                key={e.transactionHash}
                projectMeta={projectMeta}
                setSelectedEvent={setSelectedEvent}
                transaction={e}
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
  projectMeta: ProjectMeta | undefined;
}

const EventsFeedItem: React.FC<EventsFeedItemProps> = ({
  transaction,
  setSelectedEvent,
  contractAddress,
  chainSlug,
  projectMeta,
}) => {
  const { onCopy } = useClipboard(transaction.transactionHash);
  const router = useDashboardRouter();

  return (
    <AccordionItem
      _first={{ borderTop: "none" }}
      borderBottom="none"
      borderColor="borderColor"
    >
      <AccordionButton padding={0}>
        <SimpleGrid
          _last={{ borderBottomWidth: 0 }}
          alignItems="center"
          as="li"
          borderBottomWidth="1px"
          borderColor="borderColor"
          columns={12}
          gap={2}
          overflow="hidden"
          padding={4}
        >
          <Box gridColumn="span 3">
            <div className="flex flex-row items-center gap-3">
              <Tooltip
                bg="transparent"
                boxShadow="none"
                label={
                  <Card bgColor="backgroundHighlight" px={4} py={2}>
                    <Text size="label.sm">
                      Copy transaction hash to clipboard
                    </Text>
                  </Card>
                }
                p={0}
              >
                <Button
                  bg="transparent"
                  onClick={() => {
                    onCopy();
                    toast.info("Transaction hash copied.");
                  }}
                  size="sm"
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
            flexWrap="wrap"
            gap={2}
            gridColumn="span 5"
            size="sm"
            spacing={0}
            variant="outline"
          >
            {transaction.events.slice(0, 2).map((e, idx) => (
              <Button
                as="span"
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                key={idx}
                onClick={(ev) => {
                  ev.stopPropagation();
                  const path = buildContractPagePath({
                    chainIdOrSlug: chainSlug.toString(),
                    contractAddress: contractAddress,
                    projectMeta,
                    subpath: `/events?event=${e.eventName}`,
                  });

                  router.push(path);
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
            <Heading fontWeight="bold" size="subtitle.sm">
              Transaction Data
            </Heading>

            <Divider />

            <TransactionData
              description={`
                  A transaction hash is a unique 66 character identifier
                  that is generated whenever a transaction is executed.
                `}
              name="Transaction Hash"
              value={transaction.transactionHash}
            />

            <TransactionData
              description={`
                  The number of the block in which the transaction was recorded.
                  Block confirmation indicate how many blocks since the transaction was validated.
                `}
              name="Block Number"
              value={transaction.blockNumber}
            />

            <Heading fontWeight="bold" pt={6} size="subtitle.sm">
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
            bg="transparent"
            boxShadow="none"
            label={
              <Card bgColor="backgroundHighlight" px={4} py={2}>
                <Text size="label.sm">{description}</Text>
              </Card>
            }
            p={0}
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
