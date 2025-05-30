"use client";

import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { ImportModal } from "components/contract-components/import-contract/modal";
import { useTrack } from "hooks/analytics/useTrack";
import { DownloadIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";

export function DeployedContractsPageHeader(props: {
  teamId: string;
  projectId: string;
  client: ThirdwebClient;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const trackEvent = useTrack();

  return (
    <div className="border-b">
      <ImportModal
        client={props.client}
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
        teamId={props.teamId}
        projectId={props.projectId}
        type="contract"
      />

      <div className="container flex max-w-7xl flex-col gap-3 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            Contracts
          </h1>
        </div>
        <div className="flex gap-3 [&>*]:grow">
          <Button
            className="gap-2 bg-card"
            variant="outline"
            onClick={() => {
              trackEvent({
                action: "click",
                category: "contracts",
                label: "import-contract",
              });
              setImportModalOpen(true);
            }}
          >
            <DownloadIcon className="size-4" />
            Import contract
          </Button>
          <Button asChild className="gap-2">
            <TrackedLinkTW
              href="/explore"
              category="contracts"
              label="deploy-contract"
            >
              <PlusIcon className="size-4" />
              Deploy contract
            </TrackedLinkTW>
          </Button>
        </div>
      </div>
    </div>
  );
}
