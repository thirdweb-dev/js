import { zodResolver } from "@hookform/resolvers/zod";
import { createColumnHelper } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { z } from "zod";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TWTable } from "@/components/blocks/TWTable";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAllChainsData } from "@/hooks/chains/allChains";
import {
  type EngineRelayer,
  type UpdateRelayerInput,
  useEngineBackendWallets,
  useEngineRevokeRelayer,
  useEngineUpdateRelayer,
} from "@/hooks/useEngine";
import { ChainIconClient } from "@/icons/ChainIcon";
import { parseError } from "@/utils/errorParser";
import { parseAddressListRaw } from "./add-relayer-button";

const editRelayerFormSchema = z.object({
  chainId: z.number().min(1, "Chain is required"),
  backendWalletAddress: z.string().min(1, "Backend wallet is required"),
  name: z.string().optional(),
  allowedContractsRaw: z.string(),
  allowedForwardersRaw: z.string(),
});

type EditRelayerFormData = z.infer<typeof editRelayerFormSchema>;

const columnHelper = createColumnHelper<EngineRelayer>();

export function RelayersTable({
  instanceUrl,
  relayers,
  isPending,
  isFetched,
  authToken,
  client,
}: {
  instanceUrl: string;
  relayers: EngineRelayer[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
  client: ThirdwebClient;
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedRelayer, setSelectedRelayer] = useState<EngineRelayer>();
  const { idToChain } = useAllChainsData();

  const columns = [
    columnHelper.accessor("chainId", {
      cell: (cell) => {
        const chain = idToChain.get(Number.parseInt(cell.getValue()));
        return (
          <div className="flex items-center gap-2">
            <ChainIconClient
              className="size-5"
              client={client}
              src={chain?.icon?.url}
            />
            <span>{chain?.name ?? "N/A"}</span>
          </div>
        );
      },
      header: "Chain",
    }),
    columnHelper.accessor("backendWalletAddress", {
      cell: (cell) => {
        const { chainId, backendWalletAddress } = cell.row.original;
        const chain = idToChain.get(Number.parseInt(chainId));

        const explorer = chain?.explorers?.[0];
        if (!explorer) {
          return backendWalletAddress;
        }

        return (
          <WalletAddress
            address={backendWalletAddress}
            client={client}
            iconClassName="size-5"
          />
        );
      },
      header: "Backend Wallet",
    }),
    columnHelper.accessor("name", {
      cell: (cell) => {
        return <span>{cell.getValue()}</span>;
      },
      header: "Label",
    }),
    columnHelper.accessor("allowedContracts", {
      cell: (cell) => {
        const allowedContracts = cell.getValue() ?? [];
        const value =
          allowedContracts.length === 0
            ? "*"
            : allowedContracts.length === 1
              ? `${allowedContracts.length} address`
              : `${allowedContracts.length} addresses`;
        return <span>{value}</span>;
      },
      header: "Allowed Contracts",
    }),
    columnHelper.accessor("allowedForwarders", {
      cell: (cell) => {
        const allowedForwarders = cell.getValue() ?? [];
        const value =
          allowedForwarders.length === 0
            ? "*"
            : allowedForwarders.length === 1
              ? `${allowedForwarders.length} address`
              : `${allowedForwarders.length} addresses`;
        return <span>{value}</span>;
      },
      header: "Allowed Forwarders",
    }),
    columnHelper.accessor("id", {
      cell: (cell) => {
        const id = cell.getValue();
        const url = `${instanceUrl}relayer/${id}`;

        return (
          <CopyTextButton
            copyIconPosition="right"
            className="-translate-x-1.5"
            variant="ghost"
            textToCopy={url}
            textToShow={`${url.slice(0, 20)}${url.length > 20 ? "..." : ""}`}
            tooltip="Copy URL"
          />
        );
      },
      header: "URL",
    }),
  ];

  return (
    <>
      <TWTable
        columns={columns}
        data={relayers}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            onClick: (relayer) => {
              setSelectedRelayer(relayer);
              setEditDialogOpen(true);
            },
            text: "Edit",
          },
          {
            icon: <Trash2Icon className="size-4" />,
            isDestructive: true,
            onClick: (relayer) => {
              setSelectedRelayer(relayer);
              setRemoveDialogOpen(true);
            },
            text: "Remove",
          },
        ]}
        title="relayers"
      />

      {selectedRelayer && (
        <>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="p-0 overflow-hidden">
              <EditDialogContent
                authToken={authToken}
                client={client}
                instanceUrl={instanceUrl}
                relayer={selectedRelayer}
                setOpen={setEditDialogOpen}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
            <DialogContent className="p-0">
              <RemoveDialogContent
                authToken={authToken}
                client={client}
                instanceUrl={instanceUrl}
                relayer={selectedRelayer}
                setOpen={setRemoveDialogOpen}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

function EditDialogContent({
  relayer,
  setOpen,
  instanceUrl,
  authToken,
  client,
}: {
  relayer: EngineRelayer;
  setOpen: (open: boolean) => void;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const updateRelayer = useEngineUpdateRelayer({
    authToken,
    instanceUrl,
  });
  const backendWalletsQuery = useEngineBackendWallets({
    authToken,
    instanceUrl,
  });
  const { idToChain } = useAllChainsData();

  const form = useForm<EditRelayerFormData>({
    resolver: zodResolver(editRelayerFormSchema),
    defaultValues: {
      ...relayer,
      allowedContractsRaw: (relayer.allowedContracts ?? []).join("\n"),
      allowedForwardersRaw: (relayer.allowedForwarders ?? []).join("\n"),
      chainId: Number.parseInt(relayer.chainId),
    },
  });

  const onSubmit = (data: EditRelayerFormData) => {
    const updateRelayerData: UpdateRelayerInput = {
      allowedContracts: parseAddressListRaw(data.allowedContractsRaw),
      allowedForwarders: parseAddressListRaw(data.allowedForwardersRaw),
      backendWalletAddress: data.backendWalletAddress,
      chain: idToChain.get(data.chainId)?.slug ?? "unknown",
      id: relayer.id,
      name: data.name,
    };

    updateRelayer.mutate(updateRelayerData, {
      onError: (error) => {
        toast.error("Failed to update relayer", {
          description: parseError(error),
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Relayer updated successfully");
        setOpen(false);
      },
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-4 lg:p-6">
            <DialogHeader className="mb-4">
              <DialogTitle>Update Relayer</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="chainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chain</FormLabel>
                    <FormControl>
                      <SingleNetworkSelector
                        chainId={field.value}
                        disableDeprecated
                        disableChainId
                        className="bg-card"
                        client={client}
                        onChange={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="backendWalletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backend Wallet</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card">
                          <SelectValue placeholder="Select a backend wallet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {backendWalletsQuery.data?.map((wallet) => (
                          <SelectItem
                            key={wallet.address}
                            value={wallet.address}
                          >
                            {shortenAddress(wallet.address)}
                            {wallet.label && ` (${wallet.label})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder="Enter a description for this relayer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allowedContractsRaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Contracts</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-card"
                        placeholder="Enter a comma or newline-separated list of contract addresses"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Allow all contracts if omitted.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allowedForwardersRaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Forwarders</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-card"
                        placeholder="Enter a comma or newline-separated list of forwarder addresses"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Allow all forwarders if omitted.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-3 p-4 lg:p-6 border-t bg-card justify-end">
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateRelayer.isPending}
              className="gap-2"
            >
              {updateRelayer.isPending && <Spinner className="size-4" />}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function RemoveDialogContent({
  relayer,
  setOpen,
  instanceUrl,
  authToken,
  client,
}: {
  relayer: EngineRelayer;
  setOpen: (open: boolean) => void;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const revokeRelayer = useEngineRevokeRelayer({
    authToken,
    instanceUrl,
  });

  const { idToChain } = useAllChainsData();

  const onClick = () => {
    revokeRelayer.mutate(
      { id: relayer.id },
      {
        onError: (error) => {
          toast.error("Failed to remove relayer", {
            description: parseError(error),
          });
          console.error(error);
        },
        onSuccess: () => {
          toast.success("Relayer removed successfully");
          setOpen(false);
        },
      },
    );
  };

  return (
    <div>
      <div className="p-4 lg:p-6">
        <DialogHeader className="mb-5">
          <DialogTitle>Remove Relayer</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this relayer?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Chain</h3>
            <div className="flex items-center gap-2">
              <ChainIconClient
                className="size-3.5"
                client={client}
                src={idToChain.get(Number.parseInt(relayer.chainId))?.icon?.url}
              />
              <span className="text-sm">
                {idToChain.get(Number.parseInt(relayer.chainId))?.name}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Backend Wallet</h3>
            <WalletAddress
              address={relayer.backendWalletAddress}
              client={client}
              iconClassName="size-3.5"
              className="h-auto py-0"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Label</h3>
            <span className="text-sm">{relayer.name ?? <em>N/A</em>}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 p-4 lg:p-6 border-t bg-card justify-end rounded-b-lg">
        <Button onClick={() => setOpen(false)} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={onClick}
          variant="destructive"
          className="gap-2"
          disabled={revokeRelayer.isPending}
        >
          {revokeRelayer.isPending && <Spinner className="size-4" />}
          Remove
        </Button>
      </div>
    </div>
  );
}
