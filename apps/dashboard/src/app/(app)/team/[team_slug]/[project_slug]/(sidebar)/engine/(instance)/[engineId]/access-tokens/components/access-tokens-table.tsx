import { createColumnHelper } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { TWTable } from "@/components/blocks/TWTable";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/Spinner";
import {
  type AccessToken,
  useEngineRevokeAccessToken,
  useEngineUpdateAccessToken,
} from "@/hooks/useEngine";
import { toDateTimeLocal } from "@/utils/date-utils";
import { parseError } from "@/utils/errorParser";

interface AccessTokensTableProps {
  instanceUrl: string;
  accessTokens: AccessToken[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
  client: ThirdwebClient;
}

const columnHelper = createColumnHelper<AccessToken>();

export function AccessTokensTable({
  instanceUrl,
  accessTokens,
  isPending,
  isFetched,
  authToken,
  client,
}: AccessTokensTableProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedAccessToken, setSelectedAccessToken] = useState<AccessToken>();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("tokenMask", {
        cell: (cell) => (
          <p className="py-3 font-mono text-foreground">{cell.getValue()}</p>
        ),
        header: "Access Token",
      }),
      columnHelper.accessor("label", {
        cell: (cell) => (
          <span className="truncate max-w-[300px] block">
            {cell.getValue()}
          </span>
        ),
        header: "Label",
      }),
      columnHelper.accessor("walletAddress", {
        cell: (cell) => {
          const address = cell.getValue();
          return <WalletAddress address={address} client={client} />;
        },
        header: "Created By",
      }),
      columnHelper.accessor("createdAt", {
        cell: (cell) => {
          const value = cell.getValue();
          if (!value) return null;
          return <span>{toDateTimeLocal(value)}</span>;
        },
        header: "Created At",
      }),
    ];
  }, [client]);

  return (
    <>
      <TWTable
        columns={columns}
        data={accessTokens}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            onClick: (accessToken) => {
              setSelectedAccessToken(accessToken);
              setEditOpen(true);
            },
            text: "Edit",
          },
          {
            icon: <Trash2Icon className="size-4" />,
            isDestructive: true,
            onClick: (accessToken) => {
              setSelectedAccessToken(accessToken);
              setRemoveOpen(true);
            },
            text: "Delete",
          },
        ]}
        title="access tokens"
      />
      {selectedAccessToken && (
        <EditModal
          open={editOpen}
          onOpenChange={setEditOpen}
          accessToken={selectedAccessToken}
          authToken={authToken}
          instanceUrl={instanceUrl}
        />
      )}
      {selectedAccessToken && (
        <RemoveModal
          open={removeOpen}
          onOpenChange={setRemoveOpen}
          accessToken={selectedAccessToken}
          authToken={authToken}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
}

function EditModal({
  open,
  onOpenChange,
  accessToken,
  instanceUrl,
  authToken,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessToken: AccessToken;
  instanceUrl: string;
  authToken: string;
}) {
  const updateToken = useEngineUpdateAccessToken({
    authToken,
    instanceUrl,
  });

  const [label, setLabel] = useState(accessToken.label ?? "");
  const onClick = () => {
    updateToken.mutate(
      {
        id: accessToken.id,
        label,
      },
      {
        onError: (error) => {
          toast.error("Failed to update access token", {
            description: parseError(error),
          });
          console.error(error);
        },
        onSuccess: () => {
          toast.success("Successfully updated access token");
          onOpenChange(false);
        },
      },
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Update Access Token</DialogTitle>
        </DialogHeader>

        <div className="px-4 lg:px-6 space-y-5">
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Access Token </h3>
            <div className="font-mono text-sm text-muted-foreground">
              {accessToken.tokenMask}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-label">Label</Label>
            <Input
              id="edit-label"
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter a description for this access token"
              className="bg-card"
              type="text"
              value={label}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-4 lg:p-6 mt-8 bg-card">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={onClick} type="submit" className="gap-2">
            {updateToken.isPending && <Spinner className="size-4" />}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RemoveModal({
  open,
  onOpenChange,
  accessToken,
  instanceUrl,
  authToken,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessToken: AccessToken;
  instanceUrl: string;
  authToken: string;
}) {
  const deleteToken = useEngineRevokeAccessToken({
    authToken,
    instanceUrl,
  });

  const onClick = () => {
    deleteToken.mutate(
      {
        id: accessToken.id,
      },
      {
        onError: (error) => {
          toast.error("Failed to delete access token", {
            description: parseError(error),
          });
          console.error(error);
        },
        onSuccess: () => {
          toast.success("Successfully deleted access token");
          onOpenChange(false);
        },
      },
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Delete access token</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this access token?
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 lg:px-6 space-y-5">
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Access Token </h3>
            <div className="font-mono text-sm text-muted-foreground">
              {accessToken.tokenMask}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Label</Label>
            <div className="text-sm text-muted-foreground">
              {accessToken.label ?? <span> No Label </span>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-4 lg:p-6 mt-8 bg-card">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onClick}
            type="submit"
            className="gap-2"
          >
            {deleteToken.isPending && <Spinner className="size-4" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
