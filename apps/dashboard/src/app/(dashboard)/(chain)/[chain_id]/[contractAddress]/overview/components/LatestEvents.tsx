"use client";

import {
  type InternalTransaction,
  useActivity,
} from "@3rdweb-sdk/react/hooks/useActivity";
import {
  Box,
  ButtonGroup,
  Flex,
  List,
  SimpleGrid,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { useClipboard } from "hooks/useClipboard";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import {
  Button,
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedLink,
  type TrackedLinkProps,
} from "tw-components";
import { shortenString } from "utils/usedapp-external";

interface LatestEventsProps {
  trackingCategory: TrackedLinkProps["category"];
  contract: ThirdwebContract;
  chainSlug: string;
}

export const LatestEvents: React.FC<LatestEventsProps> = ({
  contract,
  trackingCategory,
  chainSlug,
}) => {
  const [autoUpdate] = useState(true);
  const eventsHref = `/${chainSlug}/${contract.address}/events`;
  const allEvents = useActivity(contract, autoUpdate);

  return (
    <Flex gap={6} flexDirection="column">
      <Flex align="center" justify="space-between" w="full">
        <h2 className="font-semibold text-2xl tracking-tight">Latest Events</h2>
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
            <div className="flex items-center justify-center py-4">
              <Flex align="center" gap={2}>
                {autoUpdate && <Spinner size="sm" speed="0.69s" />}
                <Text size="body.md" fontStyle="italic">
                  {autoUpdate ? "listening for events" : "no events to show"}
                </Text>
              </Flex>
            </div>
          ) : null}
          <div>
            {allEvents?.slice(0, 3).map((e) => (
              <EventsFeedItem
                key={e.transactionHash}
                transaction={e}
                contractAddress={contract.address}
                chainSlug={chainSlug}
              />
            ))}
          </div>
        </List>
      </Card>
    </Flex>
  );
};

interface EventsFeedItemProps {
  transaction: InternalTransaction;
  contractAddress: string;
  chainSlug: string;
}

const EventsFeedItem: React.FC<EventsFeedItemProps> = ({
  transaction,
  contractAddress,
  chainSlug,
}) => {
  const { onCopy } = useClipboard(transaction.transactionHash);
  const eventsHref = `/${chainSlug}/${contractAddress}/events`;

  return (
    <div>
      <SimpleGrid
        columns={9}
        gap={2}
        as="li"
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
                <CopyIcon className="size-3" />
              </Button>
            </Tooltip>
            <Text fontFamily="mono" noOfLines={1}>
              {shortenString(transaction.transactionHash)}
            </Text>
          </div>
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
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            <LinkButton key={idx} href={`${eventsHref}?event=${e.eventName}`}>
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
    </div>
  );
};
