import { createColumnHelper } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TWTable } from "@/components/blocks/TWTable";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner";
import { type Keypair, useEngineRemoveKeypair } from "@/hooks/useEngine";
import { toDateTimeLocal } from "@/utils/date-utils";
import { parseError } from "@/utils/errorParser";

const columnHelper = createColumnHelper<Keypair>();

const columns = [
  columnHelper.accessor("label", {
    cell: (cell) => {
      return <span>{cell.getValue()}</span>;
    },
    header: "Label",
  }),
  columnHelper.accessor("hash", {
    cell: (cell) => {
      return (
        <CopyAddressButton address={cell.getValue()} copyIconPosition="right" />
      );
    },
    header: "Key ID",
  }),
  columnHelper.accessor("publicKey", {
    cell: (cell) => {
      return (
        <PlainTextCodeBlock
          className="max-w-[350px]"
          code={cell.getValue()}
          codeClassName="text-xs"
        />
      );
    },
    header: "Public Key",
  }),
  columnHelper.accessor("algorithm", {
    cell: (cell) => {
      return <span>{cell.getValue()}</span>;
    },
    header: "Type",
  }),
  columnHelper.accessor("createdAt", {
    cell: (cell) => {
      return <span>{toDateTimeLocal(cell.getValue())}</span>;
    },
    header: "Added At",
  }),
];

export function KeypairsTable({
  instanceUrl,
  keypairs,
  isPending,
  isFetched,
  authToken,
}: {
  instanceUrl: string;
  keypairs: Keypair[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
}) {
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedKeypair, setSelectedKeypair] = useState<Keypair>();

  return (
    <>
      <TWTable
        columns={columns}
        data={keypairs}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <Trash2Icon className="size-4" />,
            isDestructive: true,
            onClick: (keypair) => {
              setSelectedKeypair(keypair);
              setIsRemoveDialogOpen(true);
            },
            text: "Remove",
          },
        ]}
        title="public keys"
      />

      {selectedKeypair && (
        <RemoveDialog
          authToken={authToken}
          instanceUrl={instanceUrl}
          keypair={selectedKeypair}
          isOpen={isRemoveDialogOpen}
          onOpenChange={setIsRemoveDialogOpen}
        />
      )}
    </>
  );
}

function RemoveDialog({
  keypair,
  instanceUrl,
  authToken,
  isOpen,
  onOpenChange,
}: {
  keypair: Keypair;
  instanceUrl: string;
  authToken: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const removeKeypairMutation = useEngineRemoveKeypair({
    authToken,
    instanceUrl,
  });

  const onClick = () => {
    removeKeypairMutation.mutate(
      { hash: keypair.hash },
      {
        onError: (error) => {
          toast.error("Failed to remove public key.", {
            description: parseError(error),
          });
          console.error(error);
        },
        onSuccess: () => {
          toast.success("Public key removed successfully.");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 lg:p-6 border-b border-dashed">
          <DialogTitle>Remove Keypair</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this keypair? Access tokens signed
            by the private key for this keypair will no longer be valid.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-hidden px-4 lg:px-6 pb-8 pt-6">
          <div className="space-y-1.">
            <h3 className="text-sm font-medium">Label</h3>
            <p className="text-sm text-muted-foreground">{keypair.label}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Type</h3>
            <p className="text-sm text-muted-foreground">{keypair.algorithm}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Public Key</h3>
            <PlainTextCodeBlock code={keypair.publicKey} />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 lg:p-6 bg-card border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onClick} className="gap-2">
            {removeKeypairMutation.isPending && <Spinner className="size-4" />}
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
