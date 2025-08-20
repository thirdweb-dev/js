"use client";

import { ImportIcon } from "lucide-react";
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
        className="gap-1.5 rounded-full"
        onClick={() => {
          setImportModalOpen(true);
        }}
        variant="outline"
      >
        <ImportIcon className="size-4" />
        Import contract
      </Button>
    </>
  );
}
