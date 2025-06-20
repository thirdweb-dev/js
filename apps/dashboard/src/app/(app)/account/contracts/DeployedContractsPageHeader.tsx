"use client";

import { ImportModal } from "components/contract-components/import-contract/modal";
import { DownloadIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { Button } from "@/components/ui/button";

export function DeployedContractsPageHeader(props: {
  teamId: string;
  projectId: string;
  client: ThirdwebClient;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <div className="border-b">
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

      <div className="container flex max-w-7xl flex-col gap-3 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            Contracts
          </h1>
        </div>
        <div className="flex gap-3 [&>*]:grow">
          <Button
            className="gap-2 bg-card"
            onClick={() => {
              setImportModalOpen(true);
            }}
            variant="outline"
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
