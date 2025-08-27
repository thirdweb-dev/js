"use client";

import { useSearchParams } from "next/navigation";
import { Fragment, useId, useMemo, useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { stringify } from "thirdweb/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { CodeClient } from "@/components/ui/code/code.client";
import { Label } from "@/components/ui/label";
import { ScrollShadow } from "@/components/ui/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useChainSlug } from "@/hooks/chains/chainSlug";
import { type InternalTransaction, useActivity } from "@/hooks/useActivity";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";

export function EventsFeed({
  contract,
  projectMeta,
}: {
  contract: ThirdwebContract;
  projectMeta: ProjectMeta | undefined;
}) {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const allEvents = useActivity(contract, autoUpdate);
  const searchParams = useSearchParams();
  const event = searchParams?.get("event");
  const [selectedEvent, setSelectedEvent] = useState(event || "all");
  const chainSlug = useChainSlug(contract.chain.id);

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
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <h2 className="text-2xl tracking-tight font-semibold flex-shrink-0">
            Latest Transactions
          </h2>
          <Select
            value={selectedEvent}
            onValueChange={(val) => {
              setSelectedEvent(val);
            }}
          >
            <SelectTrigger className="rounded-full bg-card">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">All</SelectItem>
              {eventTypes.map((eventType) => (
                <SelectItem key={eventType} value={eventType}>
                  {eventType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3">
          <Label htmlFor={autoUpdateId} className="mb-0">
            Auto-Update
          </Label>
          <Switch
            id={autoUpdateId}
            checked={autoUpdate}
            onCheckedChange={() => setAutoUpdate((val) => !val)}
          />
        </div>
      </div>

      {/* table */}
      <ScrollShadow className="overflow-x-auto rounded-lg border">
        <div className="bg-card min-w-[800px]">
          {/* table title */}
          <div className="grid grid-cols-12 gap-2 bg-background border-b uppercase tracking-wider text-xs text-muted-foreground [&>*]:px-6 [&>*]:py-4">
            <h3 className="col-span-3">Transaction Hash</h3>
            <h3 className="col-span-6">Events</h3>
            <h3 className="col-span-3">Block Number</h3>
          </div>

          {/* table body */}
          <div className="overflow-auto">
            {filteredEvents.length === 0 && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-2">
                  {autoUpdate && <Spinner className="w-4 h-4" />}
                  <span className="text-sm italic">
                    {autoUpdate ? "listening for events" : "no events to show"}
                  </span>
                </div>
              </div>
            )}

            <Accordion type="multiple" defaultValue={[]}>
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
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
}

function EventsFeedItem({
  transaction,
  setSelectedEvent,
}: {
  transaction: InternalTransaction;
  setSelectedEvent: React.Dispatch<React.SetStateAction<string>>;
  contractAddress: string;
  chainSlug: string | number;
  projectMeta: ProjectMeta | undefined;
}) {
  return (
    <AccordionItem
      value={transaction.transactionHash}
      className="border-b border-border relative last:border-b-0"
    >
      <AccordionTrigger className="py-0 hover:no-underline hover:bg-accent/50 [&>svg]:absolute [&>svg]:right-6 [&>svg]:top-[22px]">
        <div className="grid grid-cols-12 gap-2 items-center overflow-hidden w-full [&>*]:py-4 [&>*]:px-6">
          {/* col 1 */}
          <div className="col-span-3">
            <CopyTextButton
              textToShow={`${transaction.transactionHash.slice(0, 6)}...${transaction.transactionHash.slice(-4)}`}
              textToCopy={transaction.transactionHash}
              tooltip="Copy transaction hash"
              copyIconPosition="right"
              className="font-mono -translate-x-1"
              variant="ghost"
            />
          </div>

          {/* col 2 */}
          <div className="col-span-6 flex flex-wrap gap-2">
            {transaction.events.slice(0, 2).map((e, idx) => (
              <Button
                variant="outline"
                size="sm"
                // biome-ignore lint/suspicious/noArrayIndexKey: ok
                key={idx}
                className="rounded-full h-auto py-1 text-xs px-2.5"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setSelectedEvent(e.eventName);
                }}
              >
                {e.eventName}
              </Button>
            ))}

            {transaction.events.length > 2 && (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="rounded-full h-auto py-1 text-xs px-2.5"
              >
                + {transaction.events.length - 2}
              </Button>
            )}
          </div>

          {/* col 3 */}
          <div className="col-span-3 text-left text-sm">
            <CopyTextButton
              textToShow={transaction.blockNumber.toString()}
              textToCopy={transaction.blockNumber.toString()}
              tooltip="Copy block number"
              variant="ghost"
              copyIconPosition="right"
            />
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="bg-background border-t border-dashed p-6">
        <div className="space-y-4">
          <TransactionData
            name="Transaction Hash"
            value={
              <CopyTextButton
                textToShow={`${transaction.transactionHash.slice(0, 6)}...${transaction.transactionHash.slice(-4)}`}
                textToCopy={transaction.transactionHash}
                tooltip="Copy transaction hash"
                copyIconPosition="right"
                variant="ghost"
                className="font-mono -translate-x-1"
              />
            }
          />

          <div className="border-t border-dashed" />

          <TransactionData
            name="Block Number"
            value={
              <CopyTextButton
                textToShow={transaction.blockNumber.toString()}
                textToCopy={transaction.blockNumber.toString()}
                tooltip="Copy block number"
                variant="ghost"
                copyIconPosition="right"
              />
            }
          />

          <div className="border-t border-dashed" />

          {transaction.events.map((event, idx, arr) => (
            <Fragment key={`${transaction.transactionHash}_${event.logIndex}`}>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3">
                  <Badge variant="outline" className="text-sm font-normal">
                    {event.eventName}
                  </Badge>
                </div>
                <div className="col-span-9 px-4">
                  <CodeClient
                    code={stringify(event.args, null, 2)}
                    lang="json"
                  />
                </div>
              </div>

              {arr.length - 1 === idx ? null : (
                <div className="border-t border-dashed" />
              )}
            </Fragment>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function TransactionData({
  name,
  value,
}: {
  name: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-3 flex items-center">
        <span className="font-medium">{name}</span>
      </div>

      <span className="col-span-9 px-4">{value}</span>
    </div>
  );
}
