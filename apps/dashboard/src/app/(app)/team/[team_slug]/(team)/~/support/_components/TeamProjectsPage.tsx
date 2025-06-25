"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

const supportCases = [
  {
    id: "328976",
    title: "API Integration Issue",
    status: "Open",
    openedBy: "JohnDev",
    createdAt: "2025-02-15T10:38:00Z",
  },
  {
    id: "329042",
    title: "Billing Cycle Question",
    status: "Open",
    openedBy: "EmilyTech",
    createdAt: "2025-02-17T15:10:00Z",
  },
  {
    id: "328915",
    title: "Dashboard Access Issue",
    status: "Closed",
    openedBy: "AlexUser",
    createdAt: "2025-02-10T08:30:00Z",
  },
];

export default function SupportCasesPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const selectedCase = supportCases.find((c) => c.id === selectedCaseId);

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
            <h2 className="mb-2 font-semibold text-2xl">
              {selectedCase.title}
            </h2>
            <div className="mb-4 flex items-center gap-4 text-[#737373] text-sm">
              <span className="font-mono text-xs">#{selectedCase.id}</span>
              <span>
                {format(new Date(selectedCase.createdAt), "MMM d, yyyy")}
              </span>
              <span>{selectedCase.openedBy}</span>
            </div>

            <div>
              <span
                className={cn(
                  "inline-block rounded-full border px-3 py-1 font-medium text-sm",
                  selectedCase.status === "Open"
                    ? "border-green-500 text-green-500"
                    : "border-gray-500 text-gray-500",
                )}
              >
                {selectedCase.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] px-4 py-8 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          {supportCases.map((supportCase) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={supportCase.id}
              onClick={() => setSelectedCaseId(supportCase.id)}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg border border-[#262626] bg-[#121212] p-4 transition-colors hover:bg-[#1e1e1e]",
              )}
            >
              <div>
                <h2 className="mb-1 font-semibold text-lg">
                  {supportCase.title}
                </h2>
                <div className="flex items-center gap-4 text-[#737373] text-sm">
                  <span className="font-mono text-xs">#{supportCase.id}</span>
                  <span>
                    {format(new Date(supportCase.createdAt), "MMM d")}
                  </span>
                  <span>{supportCase.openedBy}</span>
                </div>
              </div>
              <div>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 font-medium text-sm",
                    supportCase.status === "Open"
                      ? "border-green-500 text-green-500"
                      : "border-gray-500 text-gray-500",
                  )}
                >
                  {supportCase.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
