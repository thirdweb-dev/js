"use client";

import { DownloadIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../../../../../@/components/ui/button";
import { ImportModal } from "../../../../../components/contract-components/import-contract/modal";

export function DeployedContractsPageHeader() {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <div>
      <ImportModal
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
      />
      <div className="flex flex-col gap-4 md:pb-4 lg:flex-row lg:justify-between">
        <div>
          <h1 className="mb-1.5 font-semibold text-3xl tracking-tight lg:text-4xl">
            Your contracts
          </h1>
          <p className="text-muted-foreground text-sm">
            The list of contract instances that you have deployed or imported
            with thirdweb across all networks
          </p>
        </div>
        <div className="flex gap-2 [&>*]:grow">
          <Button
            className="gap-2"
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
