"use client";

import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { ImportModal } from "@/components/contracts/import-contract/modal";
import { GridPattern } from "@/components/ui/background-patterns";
import { Button } from "@/components/ui/button";
import { ContractIcon } from "@/icons/ContractIcon";

export function DeployViaCLIOrImportCard(props: {
  teamId: string;
  projectId: string;
  projectSlug: string;
  teamSlug: string;
  client: ThirdwebClient;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <div className="rounded-2xl border bg-card p-4 lg:p-6 relative overflow-hidden">
      <div className="flex mb-3">
        <div className="p-2 rounded-full border bg-card">
          <ContractIcon className="size-5 text-muted-foreground" />
        </div>
      </div>
      <ImportModal
        client={props.client}
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
        projectId={props.projectId}
        projectSlug={props.projectSlug}
        teamId={props.teamId}
        teamSlug={props.teamSlug}
        type="contract"
      />

      <GridPattern
        width={30}
        height={30}
        strokeDasharray={"4 2"}
        className="text-border dark:text-border/70 hidden lg:block translate-x-5"
        style={{
          maskImage:
            "linear-gradient(to left bottom,white,transparent,transparent)",
        }}
      />

      <h2 className="mb-1 font-semibold tracking-tight text-lg">
        Already have a smart contract?
      </h2>
      <p className="text-muted-foreground text-sm">
        Import an already deployed contract or deploy a contract from source
        code to easily manage <br className="max-sm:hidden" /> permissions,
        upload assets, and interact with contract functions
      </p>

      <div className="mt-5 flex gap-3">
        <Button
          asChild
          className="gap-2 bg-background rounded-full"
          variant="outline"
          size="sm"
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
          className="gap-2 bg-background rounded-full"
          onClick={() => {
            setImportModalOpen(true);
          }}
          variant="outline"
          size="sm"
        >
          <DownloadIcon className="size-4 text-muted-foreground" />
          Import Contract
        </Button>
      </div>
    </div>
  );
}
