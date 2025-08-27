"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebContract } from "thirdweb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type InternalTransaction, useActivity } from "@/hooks/useActivity";
import { shortenString } from "@/utils/usedapp-external";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

export function LatestEvents(props: {
  contract: ThirdwebContract;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const autoUpdate = true;
  const allEvents = useActivity(props.contract, autoUpdate);

  const eventsHref = buildContractPagePath({
    chainIdOrSlug: props.chainSlug,
    contractAddress: props.contract.address,
    projectMeta: props.projectMeta,
    subpath: "/events",
  });

  return (
    <LatestEventsUI
      allEvents={allEvents}
      autoUpdate={autoUpdate}
      eventsHref={eventsHref}
    />
  );
}

export function LatestEventsUI(props: {
  allEvents: Pick<InternalTransaction, "transactionHash" | "events">[];
  autoUpdate: boolean;
  eventsHref: string;
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
              className="hidden gap-2 bg-background text-sm lg:flex"
              variant="outline"
            >
              <span className="!pointer-events-auto relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Live
            </Badge>
          )}
        </div>
        <Button asChild className="bg-background" size="sm" variant="outline">
          <Link
            className="flex items-center gap-2 text-muted-foreground text-sm"
            href={eventsHref}
          >
            View all <ArrowRightIcon className="size-4" />
          </Link>
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
                      className="-translate-x-2 font-mono"
                      copyIconPosition="left"
                      textToCopy={transaction.transactionHash}
                      textToShow={shortenString(transaction.transactionHash)}
                      tooltip="Copy transaction hash"
                      variant="ghost"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex w-max flex-wrap gap-2">
                      {transaction.events.slice(0, 3).map((e) => (
                        <Button
                          asChild
                          className="h-auto rounded-full py-1"
                          key={e.logIndex + e.address + e.eventName}
                          size="sm"
                          variant="outline"
                        >
                          <Link href={`${eventsHref}?event=${e.eventName}`}>
                            {e.eventName}
                          </Link>
                        </Button>
                      ))}

                      {transaction.events.length > 3 && (
                        <Button
                          asChild
                          className="h-auto rounded-full py-1 hover:bg-transparent"
                          size="sm"
                          variant="outline"
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
