import { zodResolver } from "@hookform/resolvers/zod";
import { createColumnHelper } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { z } from "zod";
import { TWTable } from "@/components/blocks/TWTable";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  type EngineAdmin,
  useEngineGrantPermissions,
  useEngineRevokePermissions,
} from "@/hooks/useEngine";
import { parseError } from "@/utils/errorParser";

const columnHelper = createColumnHelper<EngineAdmin>();

const editAdminSchema = z.object({
  label: z.string().optional(),
});

type EditAdminFormData = z.infer<typeof editAdminSchema>;

export function AdminsTable({
  instanceUrl,
  admins,
  isPending,
  isFetched,
  authToken,
  client,
}: {
  instanceUrl: string;
  admins: EngineAdmin[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
  client: ThirdwebClient;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<EngineAdmin>();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("walletAddress", {
        cell: (cell) => {
          const address = cell.getValue();
          return <WalletAddress address={address} client={client} />;
        },
        header: "Address",
      }),
      columnHelper.accessor("label", {
        cell: (cell) => {
          return <p className="truncate max-w-[300px]">{cell.getValue()}</p>;
        },
        header: "Label",
      }),
      columnHelper.accessor("permissions", {
        cell: (cell) => {
          return <Badge variant="default">{cell.getValue()}</Badge>;
        },
        header: "Role",
      }),
    ];
  }, [client]);

  return (
    <>
      <TWTable
        columns={columns}
        data={admins}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            onClick: (admin) => {
              setSelectedAdmin(admin);
              setEditOpen(true);
            },
            text: "Edit",
          },
          {
            icon: <Trash2Icon className="size-4" />,
            isDestructive: true,
            onClick: (admin) => {
              setSelectedAdmin(admin);
              setRemoveOpen(true);
            },
            text: "Remove",
          },
        ]}
        title="admins"
      />

      {selectedAdmin && (
        <EditDialog
          admin={selectedAdmin}
          authToken={authToken}
          instanceUrl={instanceUrl}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
      {selectedAdmin && (
        <RemoveDialog
          admin={selectedAdmin}
          authToken={authToken}
          instanceUrl={instanceUrl}
          open={removeOpen}
          onOpenChange={setRemoveOpen}
        />
      )}
    </>
  );
}

function EditDialog({
  admin,
  instanceUrl,
  authToken,
  open,
  onOpenChange,
}: {
  admin: EngineAdmin;
  instanceUrl: string;
  authToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updatePermissionsMutation = useEngineGrantPermissions({
    authToken,
    instanceUrl,
  });

  const form = useForm<EditAdminFormData>({
    resolver: zodResolver(editAdminSchema),
    values: {
      label: admin.label ?? "",
    },
  });

  const onSubmit = (data: EditAdminFormData) => {
    updatePermissionsMutation.mutate(
      {
        label: data.label,
        permissions: admin.permissions,
        walletAddress: admin.walletAddress,
      },
      {
        onError: (error) => {
          toast.error("Failed to update admin.", {
            description: parseError(error),
          });
          console.error(error);
        },
        onSuccess: () => {
          toast.success("Admin updated successfully.");
          onOpenChange(false);
          form.reset();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Update Admin</DialogTitle>
          <DialogDescription>
            Update the label for this admin.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-4 lg:px-6 pb-8">
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium">Wallet Address</h3>
                <p className="text-sm text-muted-foreground">
                  {admin.walletAddress}
                </p>
              </div>

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder="Enter a description for this admin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 p-4 lg:p-6 bg-card border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                {updatePermissionsMutation.isPending && (
                  <Spinner className="size-4" />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function RemoveDialog({
  admin,
  instanceUrl,
  authToken,
  open,
  onOpenChange,
}: {
  admin: EngineAdmin;
  instanceUrl: string;
  authToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const revokePermissionsMutation = useEngineRevokePermissions({
    authToken,
    instanceUrl,
  });

  const onClick = () => {
    revokePermissionsMutation.mutate(
      {
        walletAddress: admin.walletAddress,
      },
      {
        onError: (error) => {
          toast.error("Failed to remove admin.", {
            description: parseError(error),
          });
          console.error(error);
        },
        onSuccess: () => {
          toast.success("Admin removed successfully.");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Remove Admin</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this admin?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-4 lg:px-6 pb-8">
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Wallet Address</h3>
            <p className="text-sm text-muted-foreground">
              {admin.walletAddress}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Label</h3>
            <p className="text-sm text-muted-foreground">
              {admin.label ?? <em>N/A</em>}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 lg:p-6 bg-card border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onClick}
            className="gap-2"
          >
            {revokePermissionsMutation.isPending && (
              <Spinner className="size-4" />
            )}
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
