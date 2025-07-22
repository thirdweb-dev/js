"use client";

import { formatDate, formatDistanceToNow } from "date-fns";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Team } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import type { SupportTicketListItem } from "../types/tickets";
import {
  getTicketStatusBadgeVariant,
  getTicketStatusLabel,
} from "../utils/ticket-status";
import { SupportCaseFilters } from "./case-filters";

function isTicketOpen(ticket: SupportTicketListItem) {
  return (
    ticket.status === "in_progress" ||
    ticket.status === "needs_response" ||
    ticket.status === "on_hold"
  );
}

function isTicketClosed(ticket: SupportTicketListItem) {
  return ticket.status === "resolved" || ticket.status === "closed";
}

export function SupportsCaseList({
  tickets,
  team,
}: {
  tickets: SupportTicketListItem[];
  team: Team;
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tickets based on active tab and search query
  const filteredTickets = tickets.filter((ticket) => {
    // Filter by tab
    let matchesTab = true;
    switch (activeTab) {
      case "open":
        matchesTab = isTicketOpen(ticket);
        break;
      case "closed":
        matchesTab = isTicketClosed(ticket);
        break;
      default:
        matchesTab = true;
    }

    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Calculate counts for tabs using inline search logic
  const counts = {
    all: tickets.filter(
      (ticket) =>
        searchQuery === "" ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ).length,
    closed: tickets.filter(
      (ticket) =>
        isTicketClosed(ticket) &&
        (searchQuery === "" ||
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase())),
    ).length,
    open: tickets.filter(
      (ticket) =>
        isTicketOpen(ticket) &&
        (searchQuery === "" ||
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase())),
    ).length,
  };

  return (
    <div className="flex flex-col">
      <SupportCaseFilters
        activeTab={activeTab}
        counts={counts}
        onSearchChange={setSearchQuery}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
      />

      <div className="h-4" />

      {filteredTickets.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="border p-1 rounded-full">
                <XIcon className="size-5 text-muted-foreground" />
              </div>
            </div>

            <p className="text-muted-foreground text-sm">
              {activeTab === "all"
                ? "No Support Cases"
                : `No ${activeTab} cases found`}
            </p>
          </div>
        </div>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[200px]">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.title}
                  linkBox
                  className="hover:bg-accent/50 cursor-pointer"
                >
                  <TableCell className="py-5">
                    <Link
                      className="text-foreground font-medium text-sm before:absolute before:inset-0"
                      href={`/team/${team.slug}/~/support/cases/${ticket.id}`}
                    >
                      {ticket.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTicketStatusBadgeVariant(ticket.status)}>
                      {getTicketStatusLabel(ticket.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ToolTipLabel
                      label={formatDate(
                        new Date(ticket.updatedAt),
                        "MMM d, yyyy 'at' hh:mm a",
                      )}
                    >
                      <div className="text-sm flex items-center gap-2 z-10 relative">
                        {formatDistanceToNow(new Date(ticket.updatedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </ToolTipLabel>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
