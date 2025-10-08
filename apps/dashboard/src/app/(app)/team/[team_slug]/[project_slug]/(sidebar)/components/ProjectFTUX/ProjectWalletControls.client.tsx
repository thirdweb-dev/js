"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  EllipsisVerticalIcon,
  RefreshCcwIcon,
  SendIcon,
  ShuffleIcon,
  WalletIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { toWei } from "thirdweb";
import { useWalletBalance } from "thirdweb/react";
import { isAddress } from "thirdweb/utils";
import { z } from "zod";
import { listProjectServerWallets } from "@/actions/project-wallet/list-server-wallets";
import { sendProjectWalletTokens } from "@/actions/project-wallet/send-tokens";
import type { Project } from "@/api/project/projects";
import { FundWalletModal } from "@/components/blocks/fund-wallets-modal";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/Spinner";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ProjectWalletSummary } from "@/lib/server/project-wallet";
import { cn } from "@/lib/utils";
import { updateDefaultProjectWallet } from "../../transactions/lib/vault.client";

type ProjectWalletControlsProps = {
  walletAddress: string;
  label: string;
  project: Pick<
    Project,
    "id" | "publishableKey" | "teamId" | "services" | "name"
  >;
  defaultChainId?: number;
};

export function ProjectWalletControls(props: ProjectWalletControlsProps) {
  const { walletAddress, label, project, defaultChainId } = props;
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState(defaultChainId ?? 1);
  const [isChangeWalletOpen, setIsChangeWalletOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>(
    undefined,
  );

  const client = useMemo(() => getClientThirdwebClient(), []);
  const chain = useV5DashboardChain(selectedChainId);
  const queryClient = useQueryClient();
  const router = useDashboardRouter();

  const engineCloudService = useMemo(
    () => project.services?.find((service) => service.name === "engineCloud"),
    [project.services],
  );
  const managementAccessToken =
    engineCloudService?.managementAccessToken ?? undefined;
  const isManagedVault = !!engineCloudService?.encryptedAdminKey;

  const serverWalletsQuery = useQuery({
    enabled: !!managementAccessToken,
    queryFn: async () => {
      if (!managementAccessToken) {
        return [] as ProjectWalletSummary[];
      }

      return listProjectServerWallets({
        managementAccessToken,
        projectId: project.id,
      });
    },
    queryKey: ["project", project.id, "server-wallets", managementAccessToken],
    staleTime: 60_000,
  });

  const serverWallets = serverWalletsQuery.data ?? [];
  const currentWalletAddressLower = walletAddress.toLowerCase();
  const otherWallets = useMemo(() => {
    return serverWallets.filter((wallet) => {
      return wallet.address.toLowerCase() !== currentWalletAddressLower;
    });
  }, [serverWallets, currentWalletAddressLower]);

  const canChangeWallet = otherWallets.length > 0;

  const handleOpenChangeWallet = () => {
    const currentWallet = serverWallets.find(
      (wallet) => wallet.address.toLowerCase() === currentWalletAddressLower,
    );

    const nextWalletId =
      otherWallets[0]?.id ?? currentWallet?.id ?? serverWallets[0]?.id;

    setSelectedWalletId(nextWalletId);
    setIsChangeWalletOpen(true);
  };

  const handleCloseChangeWallet = () => {
    setIsChangeWalletOpen(false);
    setSelectedWalletId(undefined);
  };

  const selectedWallet = useMemo(() => {
    if (!selectedWalletId) {
      return undefined;
    }

    return serverWallets.find((wallet) => wallet.id === selectedWalletId);
  }, [selectedWalletId, serverWallets]);

  const isSelectionDifferent = Boolean(
    selectedWallet &&
      selectedWallet.address.toLowerCase() !== currentWalletAddressLower,
  );

  const changeWalletMutation = useMutation({
    mutationFn: async (wallet: ProjectWalletSummary) => {
      await updateDefaultProjectWallet({
        project: project as Project,
        projectWalletAddress: wallet.address,
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update project wallet";
      toast.error(message);
    },
    onSuccess: async (_, wallet) => {
      const descriptionLabel = wallet.label ?? wallet.address;
      toast.success("Default project wallet updated", {
        description: `Now pointing to ${descriptionLabel}`,
      });
      await queryClient.invalidateQueries({
        queryKey: [
          "project",
          project.id,
          "server-wallets",
          managementAccessToken,
        ],
      });
      handleCloseChangeWallet();
      router.refresh();
    },
  });

  const balanceQuery = useWalletBalance({
    address: walletAddress,
    chain,
    client,
  });

  const balanceDisplay = balanceQuery.data
    ? `${balanceQuery.data.displayValue} ${balanceQuery.data.symbol}`
    : undefined;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-background p-3">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Address</p>
              <WalletAddress address={walletAddress} client={client} />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Label</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-sm break-all py-2 sm:py-0">
                  {label}
                </p>
                {canChangeWallet && (
                  <Button
                    className="h-8 gap-1 sm:ml-4"
                    onClick={handleOpenChangeWallet}
                    size="sm"
                    disabled={serverWalletsQuery.isLoading}
                    variant="outline"
                  >
                    <ShuffleIcon className="size-3.5" />
                    Change default
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 flex-col">
              <p className="text-xs text-muted-foreground pb-2">Balance</p>
              <div className="flex items-center gap-2">
                <WalletIcon className="size-4 text-muted-foreground" />
                {balanceQuery.isLoading ? (
                  <Spinner className="size-4" />
                ) : balanceDisplay ? (
                  <span className="text-md tracking-tight">
                    {balanceDisplay}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
                <Button
                  aria-label="Refresh balance"
                  className="h-8 w-8 p-0"
                  disabled={balanceQuery.isFetching}
                  onClick={() => balanceQuery.refetch()}
                  size="icon"
                  variant="outline"
                >
                  <RefreshCcwIcon
                    className={cn(
                      "size-4",
                      balanceQuery.isFetching && "animate-spin",
                    )}
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="Open wallet actions"
                      className="h-9 w-9"
                      size="icon"
                      variant="outline"
                    >
                      <EllipsisVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onSelect={() => setIsSendOpen(true)}
                    >
                      <SendIcon className="size-4 text-muted-foreground" />
                      Send funds
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onSelect={() => setIsReceiveOpen(true)}
                    >
                      <WalletIcon className="size-4 text-muted-foreground" />
                      Receive funds
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex-col flex-1">
              <p className="text-xs text-muted-foreground pb-2">Network</p>
              <SingleNetworkSelector
                chainId={selectedChainId}
                className="max-w-xs rounded-lg"
                client={client}
                disableDeprecated
                disableChainId
                onChange={setSelectedChainId}
                placeholder="Select network"
              />
            </div>
          </div>
        </div>
      </div>

      <SendProjectWalletModal
        chainId={selectedChainId}
        client={client}
        isManagedVault={isManagedVault}
        label={label}
        onClose={() => setIsSendOpen(false)}
        onSuccess={() => balanceQuery.refetch()}
        open={isSendOpen}
        publishableKey={project.publishableKey}
        teamId={project.teamId}
        walletAddress={walletAddress}
      />

      <FundWalletModal
        checkoutWidgetTitle={`Fund ${label}`}
        client={client}
        defaultChainId={selectedChainId}
        description="Use your card or crypto to deposit into this server wallet"
        onOpenChange={setIsReceiveOpen}
        open={isReceiveOpen}
        recipientAddress={walletAddress}
        title="Fund project wallet"
      />

      <Dialog
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleCloseChangeWallet();
          }
        }}
        open={isChangeWalletOpen}
      >
        <DialogContent className="gap-0 p-0">
          <DialogHeader className="p-4 lg:p-6">
            <DialogTitle>Change default wallet</DialogTitle>
            <DialogDescription>
              Choose another server wallet to use as the default for this
              project.
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 pb-8 lg:px-6">
            {serverWalletsQuery.isLoading ? (
              <div className="flex justify-center py-6">
                <Spinner className="size-5" />
              </div>
            ) : serverWallets.length <= 1 ? (
              <p className="text-sm text-muted-foreground">
                You need at least two server wallets to pick a different
                default.
              </p>
            ) : (
              <RadioGroup
                className="space-y-3"
                onValueChange={(value) => setSelectedWalletId(value)}
                value={selectedWalletId}
              >
                {serverWallets.map((wallet) => {
                  const isCurrent =
                    wallet.address.toLowerCase() === currentWalletAddressLower;
                  const isSelected = wallet.id === selectedWalletId;

                  return (
                    <Label
                      key={wallet.id}
                      htmlFor={`project-wallet-${wallet.id}`}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition",
                        isSelected && "border-primary ring-2 ring-primary/20",
                      )}
                    >
                      <RadioGroupItem
                        id={`project-wallet-${wallet.id}`}
                        value={wallet.id}
                        className="mt-0.5"
                      />
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {wallet.label ?? "Unnamed server wallet"}
                          </span>
                          {isCurrent && (
                            <Badge variant="success" className="text-xs">
                              current
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground break-all">
                          {wallet.address}
                        </span>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-3 border-t bg-card p-4 lg:p-6">
            <Button
              onClick={handleCloseChangeWallet}
              type="button"
              variant="outline"
              disabled={changeWalletMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              disabled={
                !selectedWallet ||
                !isSelectionDifferent ||
                changeWalletMutation.isPending
              }
              onClick={() => {
                if (selectedWallet) {
                  changeWalletMutation.mutate(selectedWallet);
                }
              }}
              type="button"
            >
              {changeWalletMutation.isPending && (
                <Spinner className="mr-2 size-4" />
              )}
              Save default
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const createSendFormSchema = (secretKeyLabel: string) =>
  z.object({
    chainId: z.number({
      required_error: "Select a network",
    }),
    toAddress: z
      .string()
      .trim()
      .min(1, "Destination address is required")
      .refine((value) => Boolean(isAddress(value)), {
        message: "Enter a valid wallet address",
      }),
    amount: z.string().trim().min(1, "Amount is required"),
    secretKey: z.string().trim().min(1, `${secretKeyLabel} is required`),
    vaultAccessToken: z.string().trim(),
  });

const SECRET_KEY_LABEL = "Project secret key";

type SendFormValues = z.infer<ReturnType<typeof createSendFormSchema>>;

function SendProjectWalletModal(props: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  walletAddress: string;
  publishableKey: string;
  teamId: string;
  chainId: number;
  label: string;
  client: ReturnType<typeof getClientThirdwebClient>;
  isManagedVault: boolean;
}) {
  const {
    open,
    onClose,
    onSuccess,
    walletAddress,
    publishableKey,
    teamId,
    chainId,
    label,
    client,
    isManagedVault,
  } = props;

  const secretKeyLabel = SECRET_KEY_LABEL;
  const secretKeyPlaceholder = "Enter your project secret key";
  const secretKeyHelper =
    "Your project secret key was generated when you created your project. If you lost it, regenerate one from Project settings.";
  const vaultAccessTokenHelper =
    "Vault access tokens are optional credentials with server wallet permissions. Manage them in Vault settings.";

  const formSchema = useMemo(() => createSendFormSchema(SECRET_KEY_LABEL), []);

  const form = useForm<SendFormValues>({
    defaultValues: {
      amount: "0",
      chainId,
      secretKey: "",
      vaultAccessToken: "",
      toAddress: "",
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const selectedChain = useV5DashboardChain(form.watch("chainId"));

  // eslint-disable-next-line no-restricted-syntax -- form submission chainId must track selector state
  useEffect(() => {
    form.setValue("chainId", chainId);
  }, [chainId, form]);

  // eslint-disable-next-line no-restricted-syntax -- reset cached inputs when modal closes to avoid leaking state
  useEffect(() => {
    if (!open) {
      const currentValues = form.getValues();
      form.reset({
        amount: "0",
        chainId,
        secretKey: currentValues.secretKey ?? "",
        vaultAccessToken: currentValues.vaultAccessToken ?? "",
        toAddress: "",
      });
    }
  }, [open, chainId, form]);

  const sendMutation = useMutation({
    mutationFn: async (values: SendFormValues) => {
      const quantityWei = toWei(values.amount).toString();
      const secretKeyValue = values.secretKey.trim();
      const vaultAccessTokenValue = values.vaultAccessToken.trim();

      const result = await sendProjectWalletTokens({
        chainId: values.chainId,
        publishableKey,
        quantityWei,
        recipientAddress: values.toAddress,
        teamId,
        walletAddress,
        secretKey: secretKeyValue,
        ...(vaultAccessTokenValue
          ? { vaultAccessToken: vaultAccessTokenValue }
          : {}),
      });

      if (!result.ok) {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : "Failed to send funds";
        throw new Error(errorMessage);
      }

      return result.transactionIds;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (transactionIds) => {
      toast.success("Transfer submitted", {
        description:
          transactionIds && transactionIds.length > 0
            ? `Transaction ID: ${transactionIds[0]}`
            : undefined,
      });
      onSuccess();
      onClose();
    },
  });

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DialogContent className="gap-0 p-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Send from {label}</DialogTitle>
          <DialogDescription>
            Execute a one-off transfer using your server wallet.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              void sendMutation.mutateAsync(values);
            })}
          >
            <div className="space-y-4 px-4 pb-8 lg:px-6">
              <FormField
                control={form.control}
                name="chainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network</FormLabel>
                    <FormControl>
                      <SingleNetworkSelector
                        chainId={field.value}
                        className="bg-card"
                        client={client}
                        disableDeprecated
                        onChange={(nextChainId) => {
                          field.onChange(nextChainId);
                        }}
                        placeholder="Select network"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send to</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="0x..."
                        {...field}
                      />
                    </FormControl>
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
                      <Input
                        inputMode="decimal"
                        min="0"
                        step="any"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Sending native token
                      {selectedChain?.nativeCurrency?.symbol
                        ? ` (${selectedChain.nativeCurrency.symbol})`
                        : ""}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secretKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{secretKeyLabel}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        autoCorrect="off"
                        placeholder={secretKeyPlaceholder}
                        spellCheck={false}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{secretKeyHelper}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isManagedVault && (
                <FormField
                  control={form.control}
                  name="vaultAccessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Vault access token
                        <span className="text-muted-foreground">
                          {" "}
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          autoCorrect="off"
                          placeholder="Enter a vault access token (optional)"
                          spellCheck={false}
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {vaultAccessTokenHelper}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end gap-3 border-t bg-card p-4 lg:p-6">
              <Button onClick={onClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button
                className="gap-2"
                disabled={!form.formState.isValid || sendMutation.isPending}
                type="submit"
              >
                {sendMutation.isPending && <Spinner className="size-4" />}
                Submit transfer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
