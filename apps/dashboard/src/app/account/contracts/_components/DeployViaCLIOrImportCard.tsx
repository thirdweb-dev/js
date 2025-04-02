"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ImportModal } from "../../../../components/contract-components/import-contract/modal";

export function DeployViaCLIOrImportCard(props: {
  teamId: string;
  projectId: string;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card p-6">
      <ImportModal
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
      <p className="max-w-2xl text-muted-foreground">
        Import an already deployed contract or deploy a contract from source
        code to easily manage permissions, upload assets, and interact with
        contract functions
      </p>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" className="gap-2 lg:px-20" asChild>
          <Link
            href="https://portal.thirdweb.com/contracts/deploy/overview"
            target="_blank"
          >
            Deploy via CLI
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          className="gap-2 lg:px-6"
          onClick={() => setImportModalOpen(true)}
        >
          <DownloadIcon className="size-4" />
          Import Contract
        </Button>
      </div>
    </div>
  );
}
