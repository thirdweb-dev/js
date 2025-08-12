import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  DownloadIcon,
  ExternalLinkIcon,
  PencilIcon,
  RefreshCcwIcon,
  TrashIcon,
  TriangleAlertIcon,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAddress, type ThirdwebClient } from "thirdweb";
import { isAddress, shortenAddress } from "thirdweb/utils";
import { z } from "zod";
import { reportFundWalletOpened } from "@/analytics/report";
import { FundWalletModal } from "@/components/blocks/fund-wallets-modal";
import { TWTable } from "@/components/blocks/TWTable";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { EngineBackendWalletOptions } from "@/constants/engine";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import {
  type BackendWallet,
  useEngineBackendWalletBalance,
  useEngineDeleteBackendWallet,
  useEngineSendTokens,
  useEngineUpdateBackendWallet,
} from "@/hooks/useEngine";
import { ChainIconClient } from "@/icons/ChainIcon";
import { engineKeys } from "@/query-keys/cache-keys";
import { parseError } from "@/utils/errorParser";
import { prettyPrintCurrency } from "./utils";

// Validation schemas
const editWalletSchema = z.object({
  label: z.string().min(1, "Label is required").trim(),
});

const sendFundsSchema = z.object({
  toAddress: z
    .string()
    .min(1, "Recipient address is required")
    .refine(
      (val) => {
        if (isAddress(val)) {
          return true;
        }

        return false;
      },
      {
        message: "Invalid wallet address",
      },
    ),
  amount: z.coerce.number().min(0, "Amount must be greater than 0"),
});

type EditWalletFormValues = z.infer<typeof editWalletSchema>;
type SendFundsFormValues = z.infer<typeof sendFundsSchema>;

interface BackendWalletsTableProps {
  wallets: BackendWallet[];
  instanceUrl: string;
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
  chainId: number;
  client: ThirdwebClient;
}

interface BackendWalletDashboard extends BackendWallet {
  balance: string;
  authToken: string;
}

const columnHelper = createColumnHelper<BackendWalletDashboard>();

interface BackendWalletBalanceCellProps {
  instanceUrl: string;
  address: string;
  authToken: string;
  chainId: number;
  client: ThirdwebClient;
}

const BackendWalletBalanceCell: React.FC<BackendWalletBalanceCellProps> = ({
  instanceUrl,
  address,
  authToken,
  chainId,
}) => {
  const { data: backendWalletBalance, isFetching } =
    useEngineBackendWalletBalance({
      address,
      authToken,
      chainId,
      instanceUrl: instanceUrl,
    });
  const chain = useV5DashboardChain(chainId);

  if (!backendWalletBalance || isFetching) {
    return <Skeleton className="h-6 w-36 rounded-lg" />;
  }

  const balanceDisplay = prettyPrintCurrency({
    amount: backendWalletBalance.displayValue,
    symbol: backendWalletBalance.symbol || chain.nativeCurrency?.symbol,
  });

  const balanceComponent = <span>{balanceDisplay}</span>;

  const explorer = chain.blockExplorers?.[0];
  if (!explorer) {
    return balanceComponent;
  }

  return (
    <Link
      className="inline-flex items-center gap-2.5 rounded-lg px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
      href={`${explorer.url}/address/${address}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {balanceComponent}
      <ExternalLinkIcon className="size-4" />
    </Link>
  );
};

export const BackendWalletsTable: React.FC<BackendWalletsTableProps> = ({
  wallets,
  instanceUrl,
  isPending,
  isFetched,
  authToken,
  chainId,
  client,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("address", {
        cell: (cell) => {
          const address = cell.getValue();
          return (
            <WalletAddress address={getAddress(address)} client={client} />
          );
        },
        header: "Address",
      }),
      columnHelper.accessor("label", {
        cell: (cell) => {
          return (
            <div className="truncate max-w-[300px]">{cell.getValue()}</div>
          );
        },
        header: "Label",
      }),
      columnHelper.accessor("type", {
        cell: (cell) => {
          return <Badge variant="outline">{cell.getValue()}</Badge>;
        },
        header: "Type",
      }),
      columnHelper.accessor("address", {
        cell: (cell) => {
          const address = cell.getValue();
          return (
            <BackendWalletBalanceCell
              address={address}
              authToken={authToken}
              chainId={chainId}
              client={client}
              instanceUrl={instanceUrl}
            />
          );
        },
        header: () => (
          <div className="flex w-[180px] items-center gap-1.5">
            Balance
            <ToolTipLabel
              contentClassName="capitalize font-normal tracking-normal leading-normal"
              label="Refresh Balance"
            >
              <Button
                className="z-20 h-auto p-1.5 [&[data-pending='true']_svg]:animate-spin"
                onClick={async (e) => {
                  const buttonEl = e.currentTarget;
                  buttonEl.setAttribute("data-pending", "true");
                  await queryClient.invalidateQueries({
                    queryKey: engineKeys.backendWalletBalanceAll(),
                  });
                  buttonEl.setAttribute("data-pending", "false");
                }}
                size="sm"
                variant="ghost"
              >
                <RefreshCcwIcon className="size-4" />
              </Button>
            </ToolTipLabel>
          </div>
        ),
        id: "balance",
      }),
    ];
  }, [instanceUrl, authToken, chainId, queryClient, client]);

  const [selectedBackendWallet, setSelectedBackendWallet] =
    useState<BackendWallet>();

  return (
    <>
      <TWTable
        columns={columns as ColumnDef<BackendWallet, string>[]}
        data={wallets}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              setEditOpen(true);
            },
            text: "Edit",
          },
          {
            icon: <DownloadIcon className="size-4" />,
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              setReceiveOpen(true);
              reportFundWalletOpened();
            },
            text: "Fund wallet",
          },
          {
            icon: <UploadIcon className="size-4" />,
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              setSendOpen(true);
            },
            text: "Send funds",
          },
          {
            icon: <TrashIcon className="size-4" />,
            isDestructive: true,
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              setDeleteOpen(true);
            },
            text: "Delete",
          },
        ]}
        tableContainerClassName="border-x-0 rounded-t-none border-b-0"
        tableScrollableClassName="max-h-[1000px]"
        title="backend wallets"
      />

      {selectedBackendWallet && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="p-0 gap-0">
            <EditModalContent
              authToken={authToken}
              backendWallet={selectedBackendWallet}
              client={client}
              onOpenChange={setEditOpen}
              instanceUrl={instanceUrl}
            />
          </DialogContent>
        </Dialog>
      )}
      {selectedBackendWallet && (
        <FundWalletModal
          recipientAddress={selectedBackendWallet.address}
          client={client}
          title="Fund backend wallet"
          description="Send funds to the backend wallet"
          open={receiveOpen}
          onOpenChange={setReceiveOpen}
        />
      )}
      {selectedBackendWallet && (
        <SendFundsModal
          authToken={authToken}
          backendWallets={wallets}
          chainId={chainId}
          client={client}
          open={sendOpen}
          onOpenChange={setSendOpen}
          fromWallet={selectedBackendWallet}
          instanceUrl={instanceUrl}
        />
      )}
      {selectedBackendWallet && (
        <DeleteModal
          authToken={authToken}
          backendWallet={selectedBackendWallet}
          client={client}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
};

function EditModalContent({
  backendWallet,
  onOpenChange,
  instanceUrl,
  authToken,
  client,
}: {
  backendWallet: BackendWallet;
  onOpenChange: (open: boolean) => void;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const updateBackendWallet = useEngineUpdateBackendWallet({
    authToken,
    instanceUrl,
  });

  const form = useForm<EditWalletFormValues>({
    resolver: zodResolver(editWalletSchema),
    defaultValues: {
      label: backendWallet.label ?? "",
    },
  });

  const onSubmit = async (data: EditWalletFormValues) => {
    const promise = updateBackendWallet.mutateAsync(
      {
        label: data.label,
        walletAddress: backendWallet.address,
      },
      {
        onError: (error) => {
          console.error(error);
        },
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );

    toast.promise(promise, {
      error: "Failed to update backend wallet.",
      success: "Successfully updated backend wallet.",
    });
  };

  return (
    <div>
      <DialogHeader className="p-4 lg:p-6">
        <DialogTitle>Update Backend Wallet</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 px-4 lg:px-6 pb-6">
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Wallet Address</h3>
              <WalletAddress
                address={backendWallet.address}
                client={client}
                iconClassName="size-4"
                className="h-auto py-0"
              />
            </div>

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a description for this backend wallet"
                      type="text"
                      className="bg-card"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-3 p-4 lg:p-6 border-t bg-card rounded-b-lg">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              {updateBackendWallet.isPending && <Spinner className="size-4" />}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const SendFundsModal = ({
  fromWallet,
  backendWallets,
  open,
  onOpenChange,
  instanceUrl,
  authToken,
  chainId,
  client,
}: {
  fromWallet: BackendWallet;
  backendWallets: BackendWallet[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceUrl: string;
  authToken: string;
  chainId: number;
  client: ThirdwebClient;
}) => {
  const form = useForm<SendFundsFormValues>({
    resolver: zodResolver(sendFundsSchema),
    defaultValues: {
      toAddress: "",
      amount: 0,
    },
  });
  const sendTokens = useEngineSendTokens({
    authToken,
    instanceUrl,
  });
  const { idToChain } = useAllChainsData();
  const { data: backendWalletBalance } = useEngineBackendWalletBalance({
    address: fromWallet.address,
    authToken,
    chainId: chainId,
    instanceUrl,
  });
  const chain = idToChain.get(chainId);
  const [toWalletOpen, setToWalletOpen] = useState(false);

  if (!backendWalletBalance) {
    return null;
  }

  const onSubmit = async (data: SendFundsFormValues) => {
    sendTokens.mutateAsync(
      {
        amount: data.amount,
        chainId: chainId,
        fromAddress: fromWallet.address,
        toAddress: data.toAddress,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success("Successfully sent a request to send funds.");
        },
        onError: (error) => {
          toast.error("Failed to send tokens.", {
            description: parseError(error),
          });
          console.error(error);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Send Funds</DialogTitle>
          <DialogDescription>Send funds to a backend wallet</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-4 lg:px-6 pb-8">
              <div className="space-y-2">
                <h3 className="text-sm text-foreground">From</h3>
                <WalletAddress
                  address={fromWallet.address}
                  client={client}
                  iconClassName="size-4"
                  className="h-auto py-0"
                />
              </div>

              <FormField
                control={form.control}
                name="toAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      {toWalletOpen ? (
                        <Input
                          placeholder="Enter a wallet address"
                          {...field}
                        />
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-card">
                            <SelectValue placeholder="Select a backend wallet" />
                          </SelectTrigger>
                          <SelectContent>
                            {backendWallets
                              .filter(
                                (wallet) =>
                                  wallet.address !== fromWallet.address,
                              )
                              .map((wallet) => (
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
                      )}
                    </FormControl>
                    <Button
                      onClick={() => {
                        form.resetField("toAddress");
                        setToWalletOpen(!toWalletOpen);
                      }}
                      variant="link"
                      className="py-0 h-auto px-0 text-muted-foreground "
                      type="button"
                    >
                      {toWalletOpen
                        ? "Or send to a backend wallet"
                        : "Or send to a different wallet"}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          step="any"
                          type="number"
                          {...field}
                          className="bg-card"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {chain?.nativeCurrency.symbol}
                        </div>
                      </div>
                    </FormControl>
                    <div className="text-right text-sm text-muted-foreground">
                      Current amount:{" "}
                      {prettyPrintCurrency({
                        amount: backendWalletBalance.displayValue,
                        symbol: backendWalletBalance.symbol,
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <h3 className="text-sm text-foreground">Chain</h3>
                <div className="flex items-center gap-2">
                  <ChainIconClient
                    className="size-3"
                    client={client}
                    src={chain?.icon?.url}
                  />
                  <span className="text-sm">{chain?.name}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t bg-card p-4 lg:p-6 rounded-b-lg">
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Cancel
              </Button>
              <Button
                disabled={!form.formState.isValid}
                type="submit"
                className="gap-2"
              >
                {sendTokens.isPending && <Spinner className="size-4" />}
                Send
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

function DeleteModal({
  backendWallet,
  open,
  onOpenChange,
  instanceUrl,
  authToken,
  client,
}: {
  backendWallet: BackendWallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const deleteBackendWallet = useEngineDeleteBackendWallet({
    authToken,
    instanceUrl,
  });

  const isLocalWallet =
    backendWallet.type === "local" || backendWallet.type === "smart:local";
  const [ackDeletion, setAckDeletion] = useState(false);

  const onClick = () => {
    deleteBackendWallet.mutateAsync(
      { walletAddress: backendWallet.address },
      {
        onError: (error) => {
          toast.error("Failed to delete backend wallet.", {
            description: parseError(error),
          });
          console.error(error);
        },
        onSuccess: () => {
          toast.success("Successfully deleted backend wallet.");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Delete Backend Wallet</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this backend wallet?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-4 lg:px-6 pb-8">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Wallet Type</h3>
            <Badge variant="outline" className="py-1 text-sm">
              {
                EngineBackendWalletOptions.find(
                  (opt) => opt.key === backendWallet.type,
                )?.name
              }
            </Badge>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Wallet Address</h3>
            <WalletAddress
              address={backendWallet.address}
              client={client}
              iconClassName="size-4"
              className="h-auto py-1"
            />
          </div>

          {isLocalWallet && (
            <Alert variant="warning">
              <TriangleAlertIcon className="!text-warning-text size-4" />
              <AlertTitle>This action is irreversible.</AlertTitle>

              <AlertDescription className="!pl-0 pt-2">
                <CheckboxWithLabel>
                  <Checkbox
                    checked={ackDeletion}
                    onCheckedChange={(checked) => setAckDeletion(!!checked)}
                  />
                  I understand that access to this backend wallet and any
                  remaining funds will be lost.
                </CheckboxWithLabel>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex gap-3 justify-end border-t bg-card p-4 lg:p-6">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
          <Button
            className="gap-2"
            disabled={isLocalWallet && !ackDeletion}
            onClick={onClick}
            type="submit"
            variant="destructive"
          >
            {deleteBackendWallet.isPending && <Spinner className="size-4" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
