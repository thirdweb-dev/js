"use client";

import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import {
  type InternalTransaction,
  useActivity,
} from "@3rdweb-sdk/react/hooks/useActivity";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebContract } from "thirdweb";
import { shortenString } from "utils/usedapp-external";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

export function LatestEvents(props: {
  trackingCategory: string;
  contract: ThirdwebContract;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const autoUpdate = true;
  const allEvents = useActivity(props.contract, autoUpdate);

  const eventsHref = buildContractPagePath({
    projectMeta: props.projectMeta,
    chainIdOrSlug: props.chainSlug,
    contractAddress: props.contract.address,
    subpath: "/events",
  });

  return (
    <LatestEventsUI
      allEvents={allEvents}
      autoUpdate={autoUpdate}
      eventsHref={eventsHref}
      trackingCategory={props.trackingCategory}
    />
  );
}

export function LatestEventsUI(props: {
  allEvents: Pick<InternalTransaction, "transactionHash" | "events">[];
  autoUpdate: boolean;
  eventsHref: string;
  trackingCategory: string;
}) {
  const { allEvents, autoUpdate, eventsHref } = props;
  return (
    <div className="rounded-lg border bg-card">
      {/* header */}
      <div className="flex w-full items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Latest Events
          </h2>
          {autoUpdate && (
            <Badge
              variant="outline"
              className="hidden gap-2 bg-background text-sm lg:flex"
            >
              <span className="!pointer-events-auto relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Live
            </Badge>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="bg-background">
          <TrackedLinkTW
            category={props.trackingCategory}
            label="view_all_events"
            href={eventsHref}
            className="flex items-center gap-2 text-muted-foreground text-sm"
          >
            View all <ArrowRightIcon className="size-4" />
          </TrackedLinkTW>
        </Button>
      </div>

      {/* table */}
      <TableContainer className="w-full border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-52">Transaction Hash</TableHead>
              <TableHead>Events</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allEvents.slice(0, 3).map((transaction) => {
              return (
                <TableRow key={transaction.transactionHash}>
                  <TableCell>
                    <CopyTextButton
                      textToShow={shortenString(transaction.transactionHash)}
                      textToCopy={transaction.transactionHash}
                      tooltip="Copy transaction hash"
                      copyIconPosition="left"
                      variant="ghost"
                      className="-translate-x-2 font-mono"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex w-max flex-wrap gap-2">
                      {transaction.events.slice(0, 3).map((e) => (
                        <Button
                          key={e.logIndex + e.address + e.eventName}
                          variant="outline"
                          size="sm"
                          className="h-auto rounded-full py-1"
                          asChild
                        >
                          <Link href={`${eventsHref}?event=${e.eventName}`}>
                            {e.eventName}
                          </Link>
                        </Button>
                      ))}

                      {transaction.events.length > 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto rounded-full py-1 hover:bg-transparent"
                          asChild
                        >
                          <div>+ {transaction.events.length - 3}</div>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {allEvents.length === 0 && (
        <div className="flex h-48 items-center justify-center text-sm">
          {autoUpdate ? (
            <div className="flex items-center gap-2">
              <Spinner className="size-4" />
              <p>Listening for events</p>
            </div>
          ) : (
            <p>No events found</p>
          )}
        </div>
      )}
    </div>
  );
}
