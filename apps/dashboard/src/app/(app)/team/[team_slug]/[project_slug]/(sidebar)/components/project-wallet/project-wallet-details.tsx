"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  ArrowLeftRightIcon,
  EllipsisVerticalIcon,
  RefreshCcwIcon,
  SendIcon,
  ShuffleIcon,
  WalletIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createThirdwebClient,
  Engine,
  getContract,
  readContract,
  type ThirdwebClient,
  toUnits,
} from "thirdweb";
import type { Chain } from "thirdweb/chains";
import { SwapWidget, useWalletBalance } from "thirdweb/react";
import { isAddress, shortenAddress } from "thirdweb/utils";
import { createWalletAdapter } from "thirdweb/wallets";
import { z } from "zod";
import { sendProjectWalletTokens } from "@/actions/project-wallet/send-tokens";
import type { Project } from "@/api/project/projects";
import type { TokenMetadata } from "@/api/universal-bridge/types";
import { FundWalletModal } from "@/components/blocks/fund-wallets-modal";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TokenSelector } from "@/components/blocks/TokenSelector";
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
import { getSDKTheme } from "@/utils/sdk-component-theme";
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

const STORAGE_KEY_PREFIX = "project-wallet-selection";

function getStorageKey(projectId: string): string {
  return `${STORAGE_KEY_PREFIX}-${projectId}`;
}

type StoredSelection = {
  chainId: number;
  tokenAddress: string | undefined;
};

function readStoredSelection(projectId: string): StoredSelection | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const stored = localStorage.getItem(getStorageKey(projectId));
    if (stored) {
      return JSON.parse(stored) as StoredSelection;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveStoredSelection(projectId: string, selection: StoredSelection) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(getStorageKey(projectId), JSON.stringify(selection));
  } catch {
    // Ignore storage errors
  }
}

export function ProjectWalletDetailsSection(props: ProjectWalletControlsProps) {
  const { projectWallet, project, defaultChainId } = props;
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isChangeWalletOpen, setIsChangeWalletOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);

  // Persist swap credentials in memory so users don't have to re-enter them
  const [swapSecretKey, setSwapSecretKey] = useState("");
  const [swapVaultAccessToken, setSwapVaultAccessToken] = useState("");

  // Initialize chain and token from localStorage or defaults
  const [selectedChainId, setSelectedChainId] = useState(() => {
    const stored = readStoredSelection(project.id);
    return stored?.chainId ?? defaultChainId ?? 1;
  });
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<
    string | undefined
  >(() => {
    const stored = readStoredSelection(project.id);
    if (stored) {
      return stored.tokenAddress;
    }
    return undefined;
  });

  const chain = useV5DashboardChain(selectedChainId);

  // Handle chain change - reset token to native when chain changes
  const handleChainChange = useCallback(
    (newChainId: number) => {
      setSelectedChainId((prevChainId) => {
        if (prevChainId !== newChainId) {
          // Reset token to native (undefined) when chain changes
          setSelectedTokenAddress(undefined);
          saveStoredSelection(project.id, {
            chainId: newChainId,
            tokenAddress: undefined,
          });
        }
        return newChainId;
      });
    },
    [project.id],
  );

  // Handle token change
  const handleTokenChange = useCallback(
    (token: TokenMetadata) => {
      setSelectedTokenAddress(token.address);
      saveStoredSelection(project.id, {
        chainId: selectedChainId,
        tokenAddress: token.address,
      });
    },
    [project.id, selectedChainId],
  );

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
    tokenAddress: selectedTokenAddress,
  });

  const canChangeWallet =
    serverWalletsQuery.data && serverWalletsQuery.data.length > 1;

  const router = useDashboardRouter();

  return (
    <div>
      <div className="rounded-xl border border-border bg-card">
        <div className="p-5 flex flex-col lg:flex-row gap-5">
          <div className="flex-1">
            <p className="text-sm text-foreground mb-1">Wallet Address</p>
            <CopyTextButton
              textToShow={shortenAddress(projectWallet.address, 6)}
              textToCopy={projectWallet.address}
              tooltip="Copy wallet address"
              copyIconPosition="right"
              variant="ghost"
              className="text-muted-foreground -translate-x-1.5 py-0 h-auto"
            />
          </div>

          <div className="flex-1">
            <p className="text-sm text-foreground mb-1">Wallet Label</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm break-all py-2 sm:py-0 text-muted-foreground">
                {projectWallet.label || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-dashed flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
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

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SingleNetworkSelector
              chainId={selectedChainId}
              className="w-full sm:w-fit rounded-full bg-background hover:bg-accent/50"
              client={props.client}
              disableDeprecated
              disableChainId
              onChange={handleChainChange}
              placeholder="Select network"
              popoverContentClassName="!w-[320px] rounded-xl overflow-hidden"
              align="end"
            />
            <TokenSelector
              selectedToken={
                selectedTokenAddress
                  ? { chainId: selectedChainId, address: selectedTokenAddress }
                  : undefined
              }
              onChange={handleTokenChange}
              chainId={selectedChainId}
              client={props.client}
              enabled={true}
              showCheck={true}
              addNativeTokenIfMissing={true}
              placeholder="Native token"
              className="w-full sm:w-fit rounded-full bg-background hover:bg-accent/50"
              popoverContentClassName="!w-[320px] rounded-xl overflow-hidden"
              align="end"
            />
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-background hover:bg-accent/50"
            onClick={() => setIsSendOpen(true)}
          >
            <SendIcon className="size-4" />
            Withdraw
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-background hover:bg-accent/50"
            onClick={() => setIsSwapOpen(true)}
          >
            <ArrowLeftRightIcon className="size-4" />
            Swap
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="px-2 bg-background hover:bg-accent/50"
              >
                <EllipsisVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={() => setIsReceiveOpen(true)}
              >
                <WalletIcon className="size-4 text-muted-foreground" />
                Deposit
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
                Transactions
              </DropdownMenuItem>
              {canChangeWallet && (
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onSelect={() => setIsChangeWalletOpen(true)}
                >
                  <ShuffleIcon className="size-4 text-muted-foreground" />
                  Change Wallet
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
        tokenAddress={selectedTokenAddress}
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

      <Dialog onOpenChange={setIsSwapOpen} open={isSwapOpen}>
        <DialogContent className="gap-0 p-0 overflow-hidden max-w-md">
          <SwapProjectWalletModalContent
            client={props.client}
            chainId={selectedChainId}
            tokenAddress={selectedTokenAddress}
            walletAddress={projectWallet.address}
            chain={chain}
            isManagedVault={isManagedVault}
            publishableKey={project.publishableKey}
            secretKey={swapSecretKey}
            setSecretKey={setSwapSecretKey}
            vaultAccessToken={swapVaultAccessToken}
            setVaultAccessToken={setSwapVaultAccessToken}
            onClose={() => setIsSwapOpen(false)}
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

type SwapProjectWalletModalContentProps = {
  client: ThirdwebClient;
  chainId: number;
  tokenAddress: string | undefined;
  walletAddress: string;
  chain: Chain;
  isManagedVault: boolean;
  publishableKey: string;
  secretKey: string;
  setSecretKey: (value: string) => void;
  vaultAccessToken: string;
  setVaultAccessToken: (value: string) => void;
  onClose: () => void;
};

function SwapProjectWalletModalContent(
  props: SwapProjectWalletModalContentProps,
) {
  const {
    client,
    chainId,
    tokenAddress,
    walletAddress,
    chain,
    isManagedVault,
    publishableKey,
    secretKey,
    setSecretKey,
    vaultAccessToken,
    setVaultAccessToken,
    onClose,
  } = props;

  const [screen, setScreen] = useState<"credentials" | "swap">("credentials");
  const { theme } = useTheme();
  const t = theme === "light" ? "light" : "dark";

  const hasRequiredCredentials = isManagedVault
    ? secretKey.trim().length > 0
    : secretKey.trim().length > 0 && vaultAccessToken.trim().length > 0;

  const swapClient = useMemo(() => {
    if (!secretKey.trim()) {
      return null;
    }
    // use the inputted secret key to create the client used for the serverWallet
    return createThirdwebClient({
      clientId: publishableKey,
      secretKey: secretKey.trim(),
    });
  }, [secretKey, publishableKey]);

  const activeWallet = useMemo(() => {
    if (!swapClient) {
      return undefined;
    }
    const vaultAccessTokenValue = vaultAccessToken.trim();
    return createWalletAdapter({
      adaptedAccount: Engine.serverWallet({
        client: swapClient,
        address: walletAddress,
        ...(vaultAccessTokenValue
          ? { vaultAccessToken: vaultAccessTokenValue }
          : {}),
      }),
      chain: chain,
      client: swapClient,
      onDisconnect: () => {},
      switchChain: () => {},
    });
  }, [swapClient, walletAddress, chain, vaultAccessToken]);

  // Screen 1: Credentials
  if (screen === "credentials") {
    return (
      <div>
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Swap Tokens</DialogTitle>
          <DialogDescription>
            Enter your credentials to swap tokens from your project wallet
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-4 lg:px-6 lg:pb-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="swap-secret-key"
              className="text-sm font-medium leading-none"
            >
              Project secret key
            </label>
            <Input
              id="swap-secret-key"
              type="password"
              placeholder="Enter your project secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <p className="text-xs text-muted-foreground">{secretKeyHelper}</p>
          </div>

          {!isManagedVault && (
            <div className="space-y-2">
              <label
                htmlFor="swap-vault-access-token"
                className="text-sm font-medium leading-none"
              >
                Vault access token
              </label>
              <Input
                id="swap-vault-access-token"
                type="password"
                placeholder="Enter a vault access token"
                value={vaultAccessToken}
                onChange={(e) => setVaultAccessToken(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <p className="text-xs text-muted-foreground">
                {vaultAccessTokenHelper}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t bg-card p-4">
          <Button onClick={onClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => setScreen("swap")}
            type="button"
            disabled={!hasRequiredCredentials}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Screen 2: Swap Widget
  return (
    <div className="w-full">
      <DialogHeader className="p-4 lg:p-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto w-auto"
            onClick={() => setScreen("credentials")}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <div>
            <DialogTitle>Swap Tokens</DialogTitle>
            <DialogDescription>
              Swap tokens from your project wallet
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="px-4 pb-4 lg:px-6 lg:pb-6 flex justify-center">
        {activeWallet && (
          <SwapWidget
            client={props.client}
            prefill={{
              sellToken: {
                chainId: chainId,
                tokenAddress: tokenAddress,
              },
            }}
            activeWallet={activeWallet}
            theme={getSDKTheme(t)}
          />
        )}
      </div>
    </div>
  );
}

const createSendFormSchema = (secretKeyLabel: string) =>
  z.object({
    chainId: z.number({
      required_error: "Select a network",
    }),
    tokenAddress: z.string().optional(),
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
  tokenAddress?: string;
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
    tokenAddress,
    label,
    client,
    isManagedVault,
  } = props;

  const formSchema = useMemo(() => createSendFormSchema(SECRET_KEY_LABEL), []);

  const form = useForm<SendFormValues>({
    defaultValues: {
      amount: "0",
      chainId,
      tokenAddress,
      secretKey: "",
      vaultAccessToken: "",
      toAddress: "",
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const selectedChain = useV5DashboardChain(form.watch("chainId"));
  const selectedFormChainId = form.watch("chainId");

  const sendMutation = useMutation({
    mutationFn: async (values: SendFormValues) => {
      let decimals = 18;
      if (values.tokenAddress) {
        const decimalsRpc = await readContract({
          contract: getContract({
            address: values.tokenAddress,
            chain: selectedChain,
            client,
          }),
          method: "function decimals() view returns (uint8)",
          params: [],
        });
        decimals = Number(decimalsRpc);
      }
      const quantityWei = toUnits(values.amount, decimals).toString();
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
        ...(values.tokenAddress ? { tokenAddress: values.tokenAddress } : {}),
        ...(vaultAccessTokenValue
          ? { vaultAccessToken: vaultAccessTokenValue }
          : {}),
      });

      if (!result.ok) {
        const errorMessage = result.error
          ? JSON.stringify(result.error, null, 2)
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
                        // Reset token to native when chain changes
                        form.setValue("tokenAddress", undefined);
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
              name="tokenAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <FormControl>
                    <TokenSelector
                      selectedToken={
                        field.value
                          ? {
                              chainId: selectedFormChainId,
                              address: field.value,
                            }
                          : undefined
                      }
                      onChange={(token) => {
                        field.onChange(token.address);
                      }}
                      chainId={selectedFormChainId}
                      client={client}
                      enabled={true}
                      showCheck={true}
                      addNativeTokenIfMissing={true}
                      placeholder="Native token"
                      className="w-full bg-card"
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
                  <FormDescription className="text-muted-foreground text-xs">
                    {secretKeyHelper}
                  </FormDescription>
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
                    <FormLabel>Vault access token</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        autoCorrect="off"
                        placeholder="Enter a vault access token"
                        spellCheck={false}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground text-xs">
                      {vaultAccessTokenHelper}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 border-t bg-card p-4">
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
