"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftRightIcon,
  EllipsisVerticalIcon,
  RefreshCcwIcon,
  SendIcon,
  ShuffleIcon,
  WalletIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebClient, toWei } from "thirdweb";
import { useWalletBalance } from "thirdweb/react";
import { isAddress } from "thirdweb/utils";
import { z } from "zod";
import { sendProjectWalletTokens } from "@/actions/project-wallet/send-tokens";
import type { Project } from "@/api/project/projects";
import { FundWalletModal } from "@/components/blocks/fund-wallets-modal";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
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
import { Spinner } from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ProjectWalletSummary } from "@/lib/server/project-wallet";
import { cn } from "@/lib/utils";
import { updateDefaultProjectWallet } from "../../transactions/lib/vault.client";

type GetProjectServerWallets = (params: {
  managementAccessToken: string;
  projectId: string;
}) => Promise<ProjectWalletSummary[]>;

type ProjectWalletControlsProps = {
  projectWallet: ProjectWalletSummary;
  project: Project;
  defaultChainId?: number;
  teamSlug: string;
  getProjectServerWallets: GetProjectServerWallets;
  client: ThirdwebClient;
};

export function ProjectWalletDetailsSection(props: ProjectWalletControlsProps) {
  const { projectWallet, project, defaultChainId } = props;
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState(defaultChainId ?? 1);
  const [isChangeWalletOpen, setIsChangeWalletOpen] = useState(false);

  const chain = useV5DashboardChain(selectedChainId);

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

      return props.getProjectServerWallets({
        managementAccessToken,
        projectId: project.id,
      });
    },
    queryKey: ["project", project.id, "server-wallets", managementAccessToken],
    staleTime: 60_000,
  });

  const balanceQuery = useWalletBalance({
    address: projectWallet.address,
    chain,
    client: props.client,
  });

  const canChangeWallet =
    serverWalletsQuery.data && serverWalletsQuery.data.length > 1;

  const router = useDashboardRouter();

  return (
    <div>
      <div className="rounded-xl border border-border bg-card relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open wallet actions"
              className="p-2 h-auto w-auto absolute right-4 top-4 z-10"
              variant="ghost"
            >
              <EllipsisVerticalIcon className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-xl">
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

            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={() =>
                router.push(
                  `/team/${props.teamSlug}/${props.project.slug}/transactions`,
                )
              }
            >
              <ArrowLeftRightIcon className="size-4 text-muted-foreground" />
              View transactions
            </DropdownMenuItem>

            {canChangeWallet && (
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={() => setIsChangeWalletOpen(true)}
              >
                <ShuffleIcon className="size-4 text-muted-foreground" />
                Change project wallet
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="p-4 relative flex flex-col gap-5">
          <div>
            <p className="text-sm text-foreground mb-1">Wallet Address</p>
            <CopyTextButton
              textToShow={projectWallet.address}
              textToCopy={projectWallet.address}
              tooltip="Copy wallet address"
              copyIconPosition="right"
              variant="ghost"
              className="text-muted-foreground -translate-x-1.5 py-0 h-auto"
            />
          </div>

          <div>
            <p className="text-sm text-foreground mb-1">Wallet Label</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm break-all py-2 sm:py-0 text-muted-foreground">
                {projectWallet.label || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-dashed flex justify-between items-center">
          <div>
            <p className="text-sm text-foreground mb-1">Balance</p>
            <div className="flex items-center gap-1">
              {balanceQuery.isFetching || !balanceQuery.data ? (
                <Skeleton className="h-5 w-[100px]" />
              ) : (
                <span className="text-sm text-muted-foreground">
                  {balanceQuery.data.displayValue} {balanceQuery.data.symbol}
                </span>
              )}

              <Button
                aria-label="Refresh balance"
                className="p-1 h-auto w-auto"
                disabled={balanceQuery.isFetching}
                onClick={() => balanceQuery.refetch()}
                variant="ghost"
              >
                <RefreshCcwIcon
                  className={cn(
                    "size-3 text-muted-foreground",
                    balanceQuery.isFetching && "animate-spin",
                  )}
                />
              </Button>
            </div>
          </div>

          <SingleNetworkSelector
            chainId={selectedChainId}
            className="w-fit rounded-full bg-background hover:bg-accent/50"
            client={props.client}
            disableDeprecated
            disableChainId
            onChange={setSelectedChainId}
            placeholder="Select network"
            popoverContentClassName="!w-[320px] rounded-xl overflow-hidden"
            align="end"
          />
        </div>
      </div>

      <SendProjectWalletModal
        chainId={selectedChainId}
        client={props.client}
        isManagedVault={isManagedVault}
        label={projectWallet.label || ""}
        onClose={() => setIsSendOpen(false)}
        onSuccess={() => balanceQuery.refetch()}
        open={isSendOpen}
        publishableKey={project.publishableKey}
        teamId={project.teamId}
        walletAddress={projectWallet.address}
      />

      <FundWalletModal
        checkoutWidgetTitle="Fund Project Wallet"
        client={props.client}
        defaultChainId={selectedChainId}
        description="Use your card or crypto to deposit into this server wallet"
        onOpenChange={setIsReceiveOpen}
        open={isReceiveOpen}
        recipientAddress={projectWallet.address}
        title="Fund project wallet"
      />

      <Dialog onOpenChange={setIsChangeWalletOpen} open={isChangeWalletOpen}>
        <DialogContent className="gap-0 p-0 overflow-hidden">
          <ChangeProjectWalletDialogContent
            isOpen={isChangeWalletOpen}
            setIsOpen={setIsChangeWalletOpen}
            serverWallets={{
              data: serverWalletsQuery.data ?? [],
              isPending: serverWalletsQuery.isLoading,
            }}
            projectWallet={projectWallet}
            client={props.client}
            project={project}
            managementAccessToken={managementAccessToken}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChangeProjectWalletDialogContent(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  serverWallets: {
    data: ProjectWalletSummary[];
    isPending: boolean;
  };
  projectWallet: ProjectWalletSummary;
  managementAccessToken: string | undefined;
  project: Project;
  client: ThirdwebClient;
}) {
  const queryClient = useQueryClient();
  const router = useDashboardRouter();

  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>(
    props.projectWallet.id,
  );

  const serverWallets = props.serverWallets.data;

  const currentWalletAddressLower = props.projectWallet.address.toLowerCase();

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
        project: props.project,
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
    onSuccess: async () => {
      toast.success("Project wallet updated");
      await queryClient.invalidateQueries({
        queryKey: [
          "project",
          props.project.id,
          "server-wallets",
          props.managementAccessToken,
        ],
      });
      router.refresh();
    },
  });

  return (
    <div>
      <DialogHeader className="p-4 lg:p-6">
        <DialogTitle>Change Project Wallet</DialogTitle>
        <DialogDescription>
          Choose a server wallet to use as project wallet
        </DialogDescription>
      </DialogHeader>

      <div className="px-4 pb-8 lg:px-6">
        {props.serverWallets.isPending ? (
          <div className="flex justify-center py-6">
            <Spinner className="size-5" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Select
              onValueChange={(value) => {
                setSelectedWalletId(value);
              }}
              value={selectedWalletId ?? ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select server wallet">
                  {selectedWallet ? (
                    <div className="flex items-center gap-2">
                      <WalletAddress
                        address={selectedWallet.address}
                        client={props.client}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">
                          {selectedWallet.label ?? "Unnamed server wallet"}
                        </span>
                        {selectedWallet.address.toLowerCase() ===
                          currentWalletAddressLower && (
                          <Badge variant="success" className="text-xs">
                            current
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    "Select server wallet"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {serverWallets.map((wallet) => {
                  const isCurrent =
                    wallet.address.toLowerCase() === currentWalletAddressLower;

                  return (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex items-center gap-2">
                        <WalletAddress
                          address={wallet.address}
                          client={props.client}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">
                            {wallet.label ?? "Unnamed server wallet"}
                          </span>
                          {isCurrent && (
                            <Badge variant="success" className="text-xs">
                              current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t bg-card p-4 lg:p-6">
        <Button
          onClick={() => props.setIsOpen(false)}
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
          Set as project wallet
        </Button>
      </div>
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

type SendProjectWalletModalProps = {
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
};

const secretKeyLabel = SECRET_KEY_LABEL;
const secretKeyPlaceholder = "Enter your project secret key";
const secretKeyHelper =
  "Your project secret key was generated when you created your project. If you lost it, regenerate one from Project settings.";
const vaultAccessTokenHelper =
  "Vault access tokens are optional credentials with server wallet permissions. Manage them in Vault settings.";

function SendProjectWalletModal(props: SendProjectWalletModalProps) {
  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          props.onClose();
        }
      }}
      open={props.open}
    >
      <DialogContent className="gap-0 p-0 overflow-hidden">
        <SendProjectWalletModalContent {...props} />
      </DialogContent>
    </Dialog>
  );
}

function SendProjectWalletModalContent(props: SendProjectWalletModalProps) {
  const {
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
    <div className="gap-0 p-0">
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
                    <Input autoComplete="off" placeholder="0x..." {...field} />
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
                    <Input inputMode="decimal" min="0" step="any" {...field} />
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
                      <span className="text-muted-foreground"> (optional)</span>
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
                    <FormDescription>{vaultAccessTokenHelper}</FormDescription>
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
    </div>
  );
}
