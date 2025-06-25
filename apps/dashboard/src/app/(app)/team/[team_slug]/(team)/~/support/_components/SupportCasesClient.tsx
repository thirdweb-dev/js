"use client";

import type { SupportTicket } from "@/api/support";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { SupportTabs } from "./SupportTabs";

interface SupportCasesClientProps {
  tickets: SupportTicket[];
}

export default function SupportCasesClient({
  tickets,
}: SupportCasesClientProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const selectedCase = tickets.find((c) => c.id === selectedCaseId);

  // Filter tickets based on active tab
  const filteredTickets = tickets.filter((ticket) => {
    switch (activeTab) {
      case "open":
        return ticket.status === "open";
      case "resolved":
        return ticket.status === "resolved" || ticket.status === "closed";
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "border-green-500 text-green-500";
      case "resolved":
      case "closed":
        return "border-gray-500 text-gray-500";
      default:
        return "border-yellow-500 text-yellow-500";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "border-red-500 text-red-500";
      case "high":
        return "border-orange-500 text-orange-500";
      case "medium":
        return "border-yellow-500 text-yellow-500";
      case "low":
        return "border-blue-500 text-blue-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  if (selectedCase) {
    return (
      <div className="min-h-screen bg-[#000000] px-4 py-8 text-white">
        <div className="container mx-auto">
          <Button
            variant="outline"
            onClick={() => setSelectedCaseId(null)}
            className="mb-6 border-[#1F1F1F] bg-[#0A0A0A] text-white hover:bg-[#1F1F1F]"
          >
            ← Back to Cases
          </Button>

          <div className="rounded-lg border border-[#262626] bg-[#121212] p-6">
            <div className="mb-4">
              <h2 className="mb-2 font-semibold text-2xl">
                {selectedCase.title}
              </h2>
              <div className="mb-4 flex items-center gap-4 text-[#737373] text-sm">
                <span className="font-mono text-xs">#{selectedCase.id}</span>
                <span>
                  {format(new Date(selectedCase.createdAt), "MMM d, yyyy")}
                </span>
                <span>{selectedCase.openedBy}</span>
                {selectedCase.assignee && (
                  <span>Assigned to: {selectedCase.assignee}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-block rounded-full border px-3 py-1 font-medium text-sm",
                    getStatusColor(selectedCase.status),
                  )}
                >
                  {selectedCase.status}
                </span>
                {selectedCase.priority && (
                  <span
                    className={cn(
                      "inline-block rounded-full border px-3 py-1 font-medium text-sm",
                      getPriorityColor(selectedCase.priority),
                    )}
                  >
                    {selectedCase.priority}
                  </span>
                )}
              </div>
            </div>

            {selectedCase.lastMessage && (
              <div className="mt-6 rounded-lg border border-[#262626] bg-[#0A0A0A] p-4">
                <h3 className="mb-2 font-medium text-sm text-[#737373]">
                  Latest Message
                </h3>
                <p className="text-sm leading-relaxed">
                  {selectedCase.lastMessage}
                </p>
              </div>
            )}

            {selectedCase.tags && selectedCase.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-medium text-sm text-[#737373]">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#262626] bg-[#0A0A0A] px-2 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Support Cases</h2>
          <p className="mt-1 text-[#737373] text-sm">
            Manage your support tickets and track their progress
          </p>
        </div>
        <div className="text-[#737373] text-sm">
          {filteredTickets.length} case{filteredTickets.length !== 1 ? "s" : ""}
        </div>
      </div>

      <SupportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {filteredTickets.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-[#262626] bg-[#121212]">
          <div className="text-center">
            <h3 className="mb-2 font-medium text-lg">No cases found</h3>
            <p className="text-[#737373] text-sm">
              {activeTab === "all"
                ? "You don't have any support cases yet."
                : `No ${activeTab} cases found.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTickets.map((supportCase) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={supportCase.id}
              onClick={() => setSelectedCaseId(supportCase.id)}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg border border-[#262626] bg-[#121212] p-4 transition-colors hover:bg-[#1e1e1e]",
              )}
            >
              <div className="flex-1">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-lg">{supportCase.title}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 font-medium text-sm",
                        getStatusColor(supportCase.status),
                      )}
                    >
                      {supportCase.status}
                    </span>
                    {supportCase.priority && (
                      <span
                        className={cn(
                          "rounded-full border px-2 py-1 text-xs",
                          getPriorityColor(supportCase.priority),
                        )}
                      >
                        {supportCase.priority}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#737373] text-sm">
                  <span className="font-mono text-xs">#{supportCase.id}</span>
                  <span>
                    {format(new Date(supportCase.createdAt), "MMM d")}
                  </span>
                  <span>{supportCase.openedBy}</span>
                  {supportCase.assignee && (
                    <span>Assigned: {supportCase.assignee}</span>
                  )}
                </div>
                {supportCase.lastMessage && (
                  <p className="mt-2 line-clamp-2 text-[#737373] text-sm">
                    {supportCase.lastMessage}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
