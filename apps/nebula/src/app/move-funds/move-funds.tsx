"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckIcon,
  ChevronDownIcon,
  WalletIcon as LucideWalletIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type Chain,
  defineChain,
  getAddress,
  getContract,
  isAddress,
  NATIVE_TOKEN_ADDRESS,
  prepareTransaction,
  toWei,
} from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import {
  AccountAvatar,
  AccountBlobbie,
  AccountProvider,
  Blobbie,
  TokenIcon,
  TokenProvider,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useConnectedWallets,
  useSendAndConfirmTransaction,
  useSendBatchTransaction,
  useSetActiveWallet,
  useWalletBalance,
  WalletIcon,
  WalletName,
  WalletProvider,
} from "thirdweb/react";
import { shortenAddress, toTokens } from "thirdweb/utils";
import { type Account, getWalletBalance, type Wallet } from "thirdweb/wallets";
import { z } from "zod";
import { TransactionButton } from "@/components/blocks/buttons/TransactionButton";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import { DecimalInput } from "@/components/ui/decimal-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { isProd } from "@/constants/env-utils";
import { cn } from "@/lib/utils";
import { parseError } from "@/utils/parse-error";
import { MoveFundsConnectButton } from "./connect-button";
import { getClientDashboardThirdwebClient } from "./dashboard-client";

// This is the important part - using dashboard client instead of nebula client to allow users to
// to connect to their original wallet and move funds to a different wallet
const dashboardClient = getClientDashboardThirdwebClient();

export function MoveFundsPage() {
  const activeChain = useActiveWalletChain();
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();

  return (
    <main className="container flex grow flex-col justify-center pt-10 pb-20">
      <div>
        {/* header */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full border bg-card p-3">
              <LucideWalletIcon className="size-5 text-muted-foreground" />
            </div>
          </div>
          <h1 className="mb-3 font-bold text-4xl text-foreground tracking-tighter">
            Move funds
          </h1>
          <p className="mx-auto mb-3 max-w-4xl text-base text-muted-foreground">
            We've updated Nebula login to be separate from thirdweb dashboard on
            May 30, 2025, 12:00 PM PST <br />
            Users using social login are now assigned a different wallet address
            in Nebula app <br />
          </p>
          <p className="mx-auto mb-6 max-w-3xl text-muted-foreground">
            If you added any funds to the generated In-App wallet or Smart
            wallet before this update, you can still access them and move funds
            to a different wallet using this page
          </p>
        </div>

        {!activeWallet && (
          <div className="mx-auto max-w-md">
            <MoveFundsConnectButton btnClassName="!w-full !h-auto !p-3 !text-sm" />
            <p className="mt-2 text-center text-muted-foreground text-sm">
              Sign in to continue
            </p>
          </div>
        )}

        {activeWallet && activeChain && activeAccount && (
          <div className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-8">
            <SendFunds
              accountAddress={activeAccount.address}
              initialChainId={activeChain.id}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function WalletDetails(props: { wallet: Wallet; account: Account }) {
  const accountBlobbie = <AccountBlobbie className="size-8 rounded-full" />;
  const accountAvatarFallback = (
    <WalletIcon
      className="size-8 rounded-lg"
      fallbackComponent={accountBlobbie}
      loadingComponent={accountBlobbie}
    />
  );

  return (
    <WalletProvider id={props.wallet.id}>
      <AccountProvider address={props.account.address} client={dashboardClient}>
        <div className="flex items-center gap-2">
          <AccountAvatar
            className="size-8 rounded-full"
            fallbackComponent={accountAvatarFallback}
            loadingComponent={accountAvatarFallback}
          />
          <div className="flex flex-col items-start justify-start">
            <div className="text-sm">
              {shortenAddress(props.account.address)}
            </div>
            <div className="text-muted-foreground text-sm">
              {props.wallet.id === "smart" ? (
                <span> Smart Wallet </span>
              ) : (
                <WalletName
                  fallbackComponent={<span>Wallet</span>}
                  loadingComponent={<span>Wallet</span>}
                />
              )}
            </div>
          </div>
        </div>
      </AccountProvider>
    </WalletProvider>
  );
}

const formSchema = z.object({
  chainId: z.number(),
  receiverAddress: z.string().refine((val) => {
    if (isAddress(val)) {
      return true;
    }
    return false;
  }, "Invalid address"),
  tokens: z.array(
    z.object({
      amount: z.string().refine((val) => {
        const amount = Number.parseFloat(val);
        return !Number.isNaN(amount) && amount > 0;
      }, "Amount must be a positive number"),
      token: z
        .object({
          balance: z.string(),
          decimals: z.number(),
          name: z.string(),
          symbol: z.string(),
          token_address: z.string(),
        })
        .nullable(),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

function SendFunds(props: { accountAddress: string; initialChainId: number }) {
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const setActiveWallet = useSetActiveWallet();
  const connectedWallets = useConnectedWallets();
  const sendBatchTransactions = useSendBatchTransaction();
  const queryClient = useQueryClient();

  // since only the inApp and smart wallets were affected, filter out all other wallets
  const filteredConnectedWallets = connectedWallets;
  // .filter(
  //   (w) => w.id === "inApp" || w.id === "smart",
  // );;

  const sendAndConfirmTransaction = useSendAndConfirmTransaction();

  const form = useForm<FormValues>({
    defaultValues: {
      chainId: props.initialChainId,
      receiverAddress: "",
      tokens: [{ amount: "", token: null }],
    },
    resolver: zodResolver(formSchema),
  });

  function getTokenTransferTransaction(params: {
    token: WalletToken;
    amount: string;
    chain: Chain;
    receiverAddress: string;
  }) {
    const { token, amount, chain, receiverAddress } = params;

    const isNativeToken =
      getAddress(token.token_address) === getAddress(NATIVE_TOKEN_ADDRESS);

    if (isNativeToken) {
      return prepareTransaction({
        chain,
        client: dashboardClient,
        to: receiverAddress,
        value: toWei(amount),
      });
    }

    const erc20Contract = getContract({
      address: token.token_address,
      chain,
      client: dashboardClient,
    });

    return transfer({
      amount: amount,
      contract: erc20Contract,
      to: receiverAddress,
    });
  }

  async function handleBatchSubmit(params: {
    tokens: { token: WalletToken; amount: string }[];
    receiverAddress: string;
    chain: Chain;
    activeAccount: Account;
  }) {
    const { tokens, chain, receiverAddress } = params;

    const transactions = tokens.map(({ token, amount }) => {
      return getTokenTransferTransaction({
        amount,
        chain,
        receiverAddress,
        token,
      });
    });

    const txPromise = sendBatchTransactions.mutateAsync(transactions);
    toast.promise(txPromise, {
      error: (result) => {
        return {
          description: parseError(result),
          message: "Failed to send tokens. Please try again",
        };
      },
      loading: `Sending ${tokens.length} tokens`,
      success: `${tokens.length} tokens sent successfully`,
    });

    await txPromise;
  }

  async function handleSingleSubmit(params: {
    tokens: { token: WalletToken; amount: string }[];
    receiverAddress: string;
    chain: Chain;
    activeAccount: Account;
  }) {
    const { tokens, chain, receiverAddress } = params;
    let successCount = 0;

    for (const { token, amount } of tokens.values()) {
      try {
        const tx = getTokenTransferTransaction({
          amount,
          chain,
          receiverAddress,
          token,
        });

        const txPromise = sendAndConfirmTransaction.mutateAsync(tx);

        toast.promise(txPromise, {
          error: (result) => {
            return {
              description: parseError(result),
              message: `Failed to send ${token.name}. Please try again`,
            };
          },
          loading: `Sending Token ${token.name}`,
          success: `${token.name} sent successfully`,
        });

        await txPromise;

        queryClient.invalidateQueries({
          queryKey: ["walletBalance"],
        });

        successCount++;
      } catch {
        // no op
      }
    }

    if (tokens.length > 1) {
      if (successCount === tokens.length) {
        toast.success("All tokens sent successfully");
      } else {
        toast.error(`Failed to send ${tokens.length - successCount} tokens`);
      }
    }
  }

  async function handleSubmit(values: FormValues) {
    if (!activeAccount) {
      toast.error("Wallet is not connected");
      return;
    }

    // Filter out tokens that are not selected
    const validTokens = values.tokens.filter(
      (t): t is { token: WalletToken; amount: string } => t.token !== null,
    );

    if (validTokens.length === 0) {
      toast.error("Please select at least one token");
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    const chain = defineChain(values.chainId);

    try {
      if (activeAccount.sendBatchTransaction) {
        await handleBatchSubmit({
          activeAccount,
          chain,
          receiverAddress: values.receiverAddress,
          tokens: validTokens,
        });
      } else {
        await handleSingleSubmit({
          activeAccount,
          chain,
          receiverAddress: values.receiverAddress,
          tokens: validTokens,
        });
      }
    } catch {
      // no op
    }

    queryClient.invalidateQueries({
      queryKey: ["walletBalance"],
    });
  }

  const isPending =
    sendAndConfirmTransaction.isPending || sendBatchTransactions.isPending;

  return (
    <div className="rounded-xl border bg-card">
      <Form {...form}>
        <form
          className="space-y-3 p-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="space-y-1.5">
            <Label>Wallet</Label>
            <Select
              onValueChange={(value) => {
                const wallet = connectedWallets.find((w) => w.id === value);
                if (wallet) {
                  setActiveWallet(wallet);
                  form.setValue("tokens", [{ amount: "", token: null }]);
                }
              }}
              value={activeWallet?.id}
            >
              <SelectTrigger className="h-auto">
                <SelectValue placeholder="Select Wallet" />
              </SelectTrigger>
              <SelectContent>
                {filteredConnectedWallets.map((wallet) => {
                  const account = wallet.getAccount();
                  if (!account) return null;
                  return (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <WalletDetails account={account} wallet={wallet} />
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <FormField
            control={form.control}
            name="chainId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chain</FormLabel>
                <FormControl>
                  <SingleNetworkSelector
                    chainId={field.value}
                    className="bg-background"
                    client={dashboardClient}
                    disableChainId
                    onChange={(chain) => {
                      field.onChange(chain);
                      form.setValue("tokens", [{ amount: "", token: null }]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-1">
            <Label>Tokens</Label>
            <div className="space-y-2">
              {form.watch("tokens").map((tokenForm, index) => (
                <div
                  // Using combination of token address and index as key for better uniqueness
                  key={`${tokenForm.token?.token_address || ""}-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <FormField
                      control={form.control}
                      name={`tokens.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-1">
                          <FormLabel className="text-xs">Amount</FormLabel>
                          <FormControl>
                            <div className="relative w-full">
                              <DecimalInput
                                className="truncate bg-background pr-14"
                                onChange={field.onChange}
                                placeholder="0.0"
                                value={field.value}
                              />
                              <div className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                                {
                                  form.getValues(`tokens.${index}.token`)
                                    ?.symbol
                                }
                              </div>
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tokens.${index}.token`}
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-1">
                          <FormLabel className="text-xs">Token</FormLabel>
                          <FormControl>
                            <TokenSelectorPopover
                              accountAddress={props.accountAddress}
                              chainId={form.getValues("chainId")}
                              setToken={(token) => {
                                field.onChange(token);
                              }}
                              token={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("tokens").length > 1 && (
                      <ToolTipLabel label="Remove">
                        <Button
                          className="mt-7 h-[38px] w-[38px] bg-background p-0"
                          onClick={() => {
                            const currentTokens = form.getValues("tokens");
                            form.setValue(
                              "tokens",
                              currentTokens.filter((_, i) => i !== index),
                            );
                          }}
                          type="button"
                          variant="outline"
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </ToolTipLabel>
                    )}
                  </div>

                  {form.getValues(`tokens.${index}.token`) && (
                    <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
                      Balance:{" "}
                      <RenderTokenBalance
                        accountAddress={props.accountAddress}
                        chainId={form.getValues("chainId")}
                        className="text-xs"
                        tokenAddress={form.getValues(
                          `tokens.${index}.token.token_address`,
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-start gap-2">
            <Button
              className="h-auto gap-1.5 rounded-lg bg-background px-3 py-2 text-xs"
              onClick={() => {
                const currentTokens = form.getValues("tokens");
                form.setValue("tokens", [
                  ...currentTokens,
                  { amount: "", token: null },
                ]);
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              <PlusIcon className="size-4" />
              Add Token
            </Button>
          </div>

          <FormField
            control={form.control}
            name="receiverAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send to</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="0x..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="!mt-6">
            <TransactionButton
              className="w-full"
              client={dashboardClient}
              disableNoFundsPopup={true}
              isLoggedIn={true}
              isPending={isPending}
              transactionCount={undefined}
              txChainID={form.watch("chainId")}
              type="submit"
              variant="default"
            >
              Move Funds
            </TransactionButton>
          </div>
        </form>
      </Form>
    </div>
  );
}

function TokenSelectorPopover(props: {
  token: WalletToken | null;
  setToken: (token: WalletToken) => void;
  chainId: number;
  accountAddress: string;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className="h-auto w-full justify-start bg-background px-3 text-left"
          variant="outline"
        >
          {props.token ? (
            <TokenDetails
              accountAddress={props.accountAddress}
              chainId={props.chainId}
              className="gap-2"
              iconClassName="size-5"
              showBalance={false}
              token={props.token}
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="size-5 rounded-full bg-muted" />
              <span className="text-muted-foreground text-sm">
                Select Token
              </span>
            </div>
          )}

          <ChevronDownIcon className="ml-auto size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!w-80 overflow-hidden p-0">
        <TokenSelectorPopoverContent
          accountAddress={props.accountAddress}
          chainId={props.chainId}
          onSelect={(token) => {
            props.setToken(token);
            setIsPopoverOpen(false);
          }}
          selectedToken={props.token || undefined}
        />
      </PopoverContent>
    </Popover>
  );
}

function RenderTokenBalance(props: {
  accountAddress: string;
  tokenAddress: string;
  chainId: number;
  className?: string;
}) {
  const balanceQuery = useWalletBalance({
    address: props.accountAddress,
    // eslint-disable-next-line no-restricted-syntax
    chain: defineChain(props.chainId),
    client: dashboardClient,
    tokenAddress:
      getAddress(props.tokenAddress) === getAddress(NATIVE_TOKEN_ADDRESS)
        ? undefined
        : props.tokenAddress,
  });

  if (!balanceQuery.data) {
    return <Skeleton className="h-4 w-24" />;
  }

  return (
    <div className={cn("text-muted-foreground text-sm", props.className)}>
      {toTokens(balanceQuery.data.value, balanceQuery.data.decimals)}{" "}
      {balanceQuery.data.symbol}
    </div>
  );
}

function TokenSelectorPopoverContent(props: {
  accountAddress: string;
  chainId: number;
  onSelect: (token: WalletToken) => void;
  selectedToken: WalletToken | undefined;
}) {
  const [search, setSearch] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const walletTokensQuery = useWalletTokens({
    address: props.accountAddress,
    chainId: props.chainId,
  });

  const manualTokenQuery = useQuery({
    enabled: isAddress(manualAddress),
    queryFn: async () => {
      const balance = await getWalletBalance({
        address: props.accountAddress,
        // eslint-disable-next-line no-restricted-syntax
        chain: defineChain(props.chainId),
        client: dashboardClient,
        tokenAddress:
          getAddress(manualAddress) === getAddress(NATIVE_TOKEN_ADDRESS)
            ? undefined
            : manualAddress,
      });

      const tokenInfo: WalletToken = {
        balance: balance.value.toString(),
        decimals: balance.decimals,
        name: balance.name,
        symbol: balance.symbol,
        token_address: manualAddress,
      };

      return tokenInfo;
    },
    queryKey: [
      "manual-token",
      manualAddress,
      props.chainId,
      props.accountAddress,
    ],
  });

  const tokensToShow = useMemo(() => {
    return (walletTokensQuery.data || []).filter((token) => {
      return (
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.symbol.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search, walletTokensQuery.data]);

  const [tab, setTab] = useState<"owned" | "custom">("owned");

  return (
    <div>
      <TabButtons
        tabClassName="!text-sm"
        tabContainerClassName="pt-2 px-2"
        tabs={[
          {
            isActive: tab === "owned",
            name: "Owned Tokens",
            onClick: () => setTab("owned"),
          },
          {
            isActive: tab === "custom",
            name: "Custom",
            onClick: () => setTab("custom"),
          },
        ]}
      />

      {tab === "custom" && (
        <div>
          <div className="relative">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
            <Input
              className="h-12 rounded-none border-x-0 border-t-0 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background"
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Enter token address"
              value={manualAddress}
            />
          </div>

          <div className="flex h-[350px] flex-col">
            {manualAddress && !isAddress(manualAddress) && (
              <div className="border-b px-3 py-2">
                <p className="text-red-500 text-sm">Invalid address</p>
              </div>
            )}

            <div className="p-2">
              {manualTokenQuery.data && (
                <Button
                  className="h-auto w-full justify-start gap-3 p-2 text-left"
                  onClick={() => {
                    if (manualTokenQuery.data) {
                      props.onSelect(manualTokenQuery.data);
                    }
                  }}
                  variant="ghost"
                >
                  <TokenDetails
                    accountAddress={props.accountAddress}
                    chainId={props.chainId}
                    showBalance={true}
                    token={manualTokenQuery.data}
                  />
                  {props.selectedToken?.token_address ===
                    manualTokenQuery.data.token_address && (
                    <CheckIcon className="ml-auto size-4" />
                  )}
                </Button>
              )}

              {manualTokenQuery.isFetching && !manualTokenQuery.data && (
                <TokenSkeletonRow />
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "owned" && (
        <div>
          <div className="relative">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
            <Input
              className="h-12 rounded-none border-x-0 border-t-0 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search owned tokens"
              value={search}
            />
          </div>
          <ScrollShadow scrollableClassName="h-[350px] flex flex-col">
            <TokenList
              accountAddress={props.accountAddress}
              chainId={props.chainId}
              className="flex grow flex-col overflow-y-auto p-2"
              isPending={walletTokensQuery.isPending}
              onSelect={props.onSelect}
              selectedToken={props.selectedToken}
              tokens={tokensToShow || []}
            />
          </ScrollShadow>
        </div>
      )}
    </div>
  );
}

function TokenList(props: {
  accountAddress: string;
  chainId: number;
  className?: string;
  onSelect: (token: WalletToken) => void;
  selectedToken: WalletToken | undefined;
  isPending: boolean;
  tokens: WalletToken[];
}) {
  return (
    <div className={props.className}>
      {props.isPending &&
        new Array(10).fill(0).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: TODO
          <TokenSkeletonRow key={index} />
        ))}

      {!props.isPending && (
        <div className="flex grow flex-col">
          {props.tokens.length > 0 ? (
            props.tokens.map((token) => {
              return (
                <Button
                  className="h-auto w-full justify-start gap-3 p-2 text-left"
                  key={token.token_address + token.name + token.symbol}
                  onClick={() => props.onSelect(token)}
                  variant="ghost"
                >
                  <TokenDetails
                    accountAddress={props.accountAddress}
                    chainId={props.chainId}
                    showBalance={true}
                    token={token}
                  />
                  {props.selectedToken?.token_address ===
                    token.token_address && (
                    <CheckIcon className="ml-auto size-4" />
                  )}
                </Button>
              );
            })
          ) : (
            <div className="flex h-full items-center justify-center py-10 text-muted-foreground text-sm">
              No tokens found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TokenDetails(props: {
  token: WalletToken;
  chainId: number;
  showBalance: boolean;
  iconClassName?: string;
  className?: string;
  accountAddress: string;
}) {
  const blobbie = (
    <Blobbie
      address={props.token.token_address}
      className={cn("size-8 rounded-full", props.iconClassName)}
    />
  );

  return (
    <div className={cn("flex items-center gap-2.5", props.className)}>
      <TokenProvider
        address={props.token.token_address}
        chain={defineChain(props.chainId)}
        // eslint-disable-next-line no-restricted-syntax
        client={dashboardClient}
      >
        <TokenIcon
          className={cn("size-8 rounded-full", props.iconClassName)}
          fallbackComponent={blobbie}
          loadingComponent={blobbie}
        />
      </TokenProvider>
      <div>
        <div className="text-foreground text-sm"> {props.token.name} </div>
        {props.showBalance && (
          <RenderTokenBalance
            accountAddress={props.accountAddress}
            chainId={props.chainId}
            tokenAddress={props.token.token_address}
          />
        )}
      </div>
    </div>
  );
}

function TokenSkeletonRow() {
  return (
    <div className="flex h-[56px] items-center gap-3 p-2">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

type WalletToken = {
  // chain_id: number;
  token_address: string;
  // owner_address: string;
  balance: string;
  name: string;
  symbol: string;
  decimals: number;
};

function useWalletTokens(params: { address: string; chainId: number }) {
  return useQuery({
    queryFn: async () => {
      const url = new URL(
        `https://insight.${isProd ? "thirdweb" : "thirdweb-dev"}.com/v1/tokens`,
      );
      url.searchParams.set("owner_address", params.address);
      url.searchParams.set("chain_id", params.chainId.toString());
      url.searchParams.set("clientId", dashboardClient.clientId);
      url.searchParams.set("limit", "100");
      url.searchParams.set("metadata", "true");
      url.searchParams.set("resolve_metadata_links", "true");
      url.searchParams.set("include_spam", "false");
      url.searchParams.set("include_native", "true");

      const response = await fetch(url);
      const json = (await response.json()) as {
        data: WalletToken[];
      };

      // There's a bug in v1/tokens endpoint where it returns token multiple times
      // This is a temporary fix to remove duplicates
      const uniqueTokens = json.data.filter(
        (token, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.token_address === token.token_address &&
              t.name === token.name &&
              t.symbol === token.symbol,
          ),
      );

      return uniqueTokens;
    },
    queryKey: ["v1/tokens", params],
  });
}
