"use client";

import { ArrowDownToLineIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { ImportModal } from "@/components/contracts/import-contract/modal";
import { Button } from "@/components/ui/button";

export function ImportContractButton(props: {
  teamId: string;
  projectId: string;
  projectSlug: string;
  teamSlug: string;
  client: ThirdwebClient;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <>
      <ImportModal
        allowedContractType="non-token"
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

      <Button
        className="gap-2 rounded-full bg-card"
        size="sm"
        onClick={() => {
          setImportModalOpen(true);
        }}
        variant="outline"
      >
        <ArrowDownToLineIcon className="size-3.5 text-muted-foreground" />
        Import contract
      </Button>
    </>
  );
}
