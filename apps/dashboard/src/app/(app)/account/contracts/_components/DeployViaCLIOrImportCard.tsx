"use client";

import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { ImportModal } from "@/components/contracts/import-contract/modal";
import { Button } from "@/components/ui/button";

export function DeployViaCLIOrImportCard(props: {
  teamId: string;
  projectId: string;
  client: ThirdwebClient;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card p-4 lg:p-6">
      <ImportModal
        client={props.client}
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
        projectId={props.projectId}
        teamId={props.teamId}
        type="contract"
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
          asChild
          className="gap-2 bg-background lg:px-10"
          variant="outline"
        >
          <Link
            href="https://portal.thirdweb.com/contracts/deploy/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            Deploy via CLI
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
        <Button
          className="gap-2 bg-background"
          onClick={() => {
            setImportModalOpen(true);
          }}
          variant="outline"
        >
          <DownloadIcon className="size-4" />
          Import Contract
        </Button>
      </div>
    </div>
  );
}
