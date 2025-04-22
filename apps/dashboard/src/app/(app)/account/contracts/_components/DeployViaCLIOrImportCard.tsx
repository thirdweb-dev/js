"use client";

import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { ImportModal } from "components/contract-components/import-contract/modal";
import { useTrack } from "hooks/analytics/useTrack";
import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";

export function DeployViaCLIOrImportCard(props: {
  teamId: string;
  projectId: string;
}) {
  const trackEvent = useTrack();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const client = useThirdwebClient();

  return (
    <div className="rounded-lg border bg-card p-4 lg:p-6">
      <ImportModal
        client={client}
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
        teamId={props.teamId}
        projectId={props.projectId}
      />

      <h2 className="mb-0.5 font-semibold text-lg">
        Already have a smart contract?
      </h2>
      <p className="max-w-2xl text-muted-foreground text-sm lg:text-base">
        Import an already deployed contract or deploy a contract from source
        code to easily manage permissions, upload assets, and interact with
        contract functions
      </p>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <Button
          variant="outline"
          className="gap-2 bg-background lg:px-10"
          asChild
        >
          <TrackedLinkTW
            href="https://portal.thirdweb.com/contracts/deploy/overview"
            target="_blank"
            category="contracts-banner"
            label="deploy-via-cli"
          >
            Deploy via CLI
            <ArrowUpRightIcon className="size-4" />
          </TrackedLinkTW>
        </Button>
        <Button
          variant="outline"
          className="gap-2 bg-background"
          onClick={() => {
            setImportModalOpen(true);
            trackEvent({
              category: "contracts-banner",
              action: "click",
              label: "import-contract",
            });
          }}
        >
          <DownloadIcon className="size-4" />
          Import Contract
        </Button>
      </div>
    </div>
  );
}
