"use client";

import { Button } from "@/components/ui/button";
import { ImportModal } from "components/contract-components/import-contract/modal";
import { DownloadIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function DeployedContractsPageHeader(props: {
  teamId: string;
  projectId: string;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <div className="border-b">
      <ImportModal
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
        teamId={props.teamId}
        projectId={props.projectId}
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
            onClick={() => setImportModalOpen(true)}
          >
            <DownloadIcon className="size-4" />
            Import contract
          </Button>
          <Button asChild className="gap-2">
            <Link href="/explore">
              <PlusIcon className="size-4" />
              Deploy contract
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
