"use client";
import { TabButtons } from "@/components/ui/tabs";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { ImportModal } from "../../../../../../components/contract-components/import-contract/modal";
import { StepsCard } from "../../../../../../components/dashboard/StepsCard";
import { useTrack } from "../../../../../../hooks/analytics/useTrack";

export function GetStartedWithContractsDeploy() {
  const address = useActiveAccount()?.address;
  const steps = useMemo(
    () => [
      {
        title: "Connect your wallet to get started",
        description:
          "In order to interact with your contracts you need to connect an EVM compatible wallet.",
        children: <CustomConnectWallet />,
        completed: !!address,
      },

      {
        title: "Build, deploy or import a contract",
        description:
          "Choose between deploying your own contract or import an existing one.",
        children: <DeployOptions />,
        completed: false, // because we only show this component if the user does not have any contracts
      },
    ],
    [address],
  );

  return (
    <StepsCard
      title="Get started with deploying contracts"
      description="This guide will help you to start deploying contracts on-chain in just a few minutes."
      steps={steps}
    />
  );
}

type ContentItem = {
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
};

const DeployOptions = () => {
  const [showImportModal, setShowImportModal] = useState(false);
  const router = useDashboardRouter();
  const trackEvent = useTrack();

  const content: Record<string, ContentItem> = useMemo(
    () => ({
      explore: {
        title: "Ready-to-deploy",
        description:
          "Pick from our library of ready-to-deploy contracts and deploy to any EVM chain in just 1-click.",
        href: "/explore",
      },
      import: {
        title: "Import",
        description:
          "Import an already deployed contract to build apps on top of contract using thirdweb tools.",
        onClick: () => setShowImportModal(true),
      },
      build: {
        title: "Build your own",
        description:
          "Get started with the Solidity SDK to create custom contracts specific to your use case.",
        href: "/build",
      },
      deploy: {
        title: "Deploy from source",
        description:
          "Deploy your contract by using our interactive CLI. (Supports Hardhat, Forge, Truffle, and more)",
        href: "https://portal.thirdweb.com/cli",
      },
    }),
    [],
  );

  const contentKeys = Object.keys(content);
  const [activeTab, setActiveTab] = useState(contentKeys[0]);
  const activeTabContent = content[activeTab];

  return (
    <>
      <ImportModal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
        }}
      />

      <TabButtons
        tabs={Object.entries(content).map(([key, value]) => ({
          key,
          name: value.title,
          isActive: activeTab === key,
          isEnabled: true,
          onClick: () => setActiveTab(key),
        }))}
        tabClassName="font-medium !text-sm"
      />

      <button
        className="mt-3 flex w-full cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 hover:bg-muted"
        type="button"
        onClick={() => {
          activeTabContent.onClick?.();
          if (activeTabContent.href) {
            router.push(activeTabContent.href);
          }

          trackEvent({
            category: "your_contracts",
            action: "click",
            label: "deploy_options",
            type: activeTab,
            href: null,
            isExternal: false,
          });
        }}
      >
        <Image
          width={32}
          height={32}
          className="size-8"
          alt=""
          src={`/assets/dashboard/contracts/${activeTab}.${
            activeTab === "import" ? "svg" : "png"
          }`}
        />
        <div>
          <h4 className="text-start font-semibold text-lg">
            {activeTabContent.title}
          </h4>
          <p className="text-muted-foreground text-sm">
            {activeTabContent.description}
          </p>
        </div>
      </button>
    </>
  );
};
