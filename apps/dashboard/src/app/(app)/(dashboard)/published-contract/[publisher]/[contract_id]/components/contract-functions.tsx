"use client";

import type { Abi, AbiEvent, AbiFunction } from "abitype";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import type { SourceFile } from "@/components/contract-components/types";
import { CodeOverview } from "@/components/contracts/code-overview";
import { ContractFunctionsPanel } from "@/components/contracts/functions/contract-function";
import { SourcesPanel } from "@/components/contracts/sources/sources-panel";
import { TabButtons } from "@/components/ui/tabs";

interface ContractFunctionsOverview {
  functions?: AbiFunction[] | null;
  events?: AbiEvent[] | null;
  contract?: ThirdwebContract;
  sources?: SourceFile[];
  abi?: Abi;
  isLoggedIn: boolean;
}

type Tab = "functions" | "events" | "code" | "sources";

export const ContractFunctionsOverview: React.FC<ContractFunctionsOverview> = ({
  functions,
  events,
  contract,
  sources,
  abi,
  isLoggedIn,
}) => {
  const [activeTab, setActiveTab] = useState<Tab | undefined>(() => {
    if (functions && functions.length > 0) return "functions";
    if (events && events.length > 0) return "events";
    if (abi) return "code";
    if (sources && sources.length > 0) return "sources";
    return undefined;
  });

  // Tab index: 0 = Functions, 1 = Events, 2 = Code, 3 = Sources
  const tabOptions = [
    ...(functions && functions.length > 0
      ? [
          {
            name: "Functions",
            onClick: () => setActiveTab("functions"),
            isActive: activeTab === "functions",
          },
        ]
      : []),
    ...(events && events.length > 0
      ? [
          {
            name: "Events",
            onClick: () => setActiveTab("events"),
            isActive: activeTab === "events",
          },
        ]
      : []),
    ...(abi
      ? [
          {
            name: "Code",
            onClick: () => setActiveTab("code"),
            isActive: activeTab === "code",
          },
        ]
      : []),
    ...(sources && sources.length > 0
      ? [
          {
            name: "Sources",
            onClick: () => setActiveTab("sources"),
            isActive: activeTab === "sources",
          },
        ]
      : []),
  ];

  return (
    <div>
      <TabButtons tabs={tabOptions} />
      <div className="pt-4">
        {functions && functions.length > 0 && activeTab === "functions" && (
          <div className="h-[70vh]">
            <ContractFunctionsPanel
              contract={contract}
              fnsOrEvents={functions}
              isLoggedIn={isLoggedIn}
            />
          </div>
        )}
        {events && events.length > 0 && activeTab === "events" && (
          <div className="h-[70vh]">
            <ContractFunctionsPanel
              contract={contract}
              fnsOrEvents={events}
              isLoggedIn={isLoggedIn}
            />
          </div>
        )}
        {abi && activeTab === "code" && (
          <CodeOverview abi={abi} chainId={contract?.chain.id || 1} noSidebar />
        )}
        {sources && sources.length > 0 && activeTab === "sources" && (
          <SourcesPanel abi={abi} sources={sources} />
        )}
      </div>
    </div>
  );
};
