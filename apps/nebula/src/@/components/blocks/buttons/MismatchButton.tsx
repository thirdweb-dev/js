"use client";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getSDKTheme } from "@/config/sdk-component-theme";
import { LOCAL_NODE_PKEY } from "@/constants/local-node";
import { useAllChainsData } from "@/hooks/chains";
import { cn } from "@/lib/utils";
import type { ChainMetadataWithServices, ChainServices } from "@/types/chain";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { getSDKTheme } from "app/(app)/components/sdk-component-theme";
// import { useAllChainsData } from "hooks/chains/allChains";
import { ExternalLinkIcon, UnplugIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { forwardRef, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import {
  type ThirdwebClient,
  prepareTransaction,
  sendTransaction,
  toWei,
} from "thirdweb";
import {
  type Chain,
  type ChainMetadata,
  defineChain,
  localhost,
} from "thirdweb/chains";
import {
  PayEmbed,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useSwitchActiveWalletChain,
  useWalletBalance,
} from "thirdweb/react";
import { type Wallet, privateKeyToAccount } from "thirdweb/wallets";

const GAS_FREE_CHAINS = [
  75513, // Geek verse testnet
  75512, // Geek verse mainnet
  531050104, // sophon testnet
  50104, // sophon mainnet
  37111, // lens sepolia
  4457845, // zero testnet
  978658, // treasure topaz
  300, // zksync sepolia
  7225878, // Saakuru Mainnet
  247253, // Saakuru Testnet
  19011, // Homeverse Mainnet
  40875, // Homeverse Testnet
  5464, // Saga Mainnet
];

function useIsNetworkMismatch(txChainId: number) {
  const walletChainId = useActiveWalletChain()?.id;
  if (!walletChainId) {
    // simply not ready yet, assume false
    return false;
  }
  // otherwise, compare the chain ids
  return walletChainId !== txChainId;
}

type MistmatchButtonProps = React.ComponentProps<typeof Button> & {
  txChainId: number;
  isLoggedIn: boolean;
  isPending: boolean;
  checkBalance?: boolean;
  client: ThirdwebClient;
  disableNoFundsPopup: boolean;
};

export const MismatchButton = forwardRef<
  HTMLButtonElement,
  MistmatchButtonProps
>((props, ref) => {
  const {
    txChainId,
    isLoggedIn,
    isPending,
    checkBalance = true,
    disableNoFundsPopup,
    ...buttonProps
  } = props;
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const activeWalletChain = useActiveWalletChain();
  const [dialog, setDialog] = useState<undefined | "no-funds" | "pay">();
  const { theme } = useTheme();
  const pathname = usePathname();

  const connectionStatus = useActiveWalletConnectionStatus();
  const txChain = defineChain(txChainId);

  const txChainBalance = useWalletBalance({
    address: account?.address,
    chain: txChain,
    client: props.client,
  });

  const networksMismatch = useIsNetworkMismatch(txChainId);
  const switchNetwork = useSwitchActiveWalletChain();

  const showSwitchChainPopover =
    networksMismatch && wallet && !canSwitchNetworkWithoutConfirmation(wallet);

  const [isMismatchPopoverOpen, setIsMismatchPopoverOpen] = useState(false);
  // const trackEvent = useTrack();

  const chainId = activeWalletChain?.id;

  const switchNetworkMutation = useMutation({
    mutationFn: switchNetwork,
  });

  const eventRef =
    useRef<React.MouseEvent<HTMLButtonElement, MouseEvent>>(undefined);

  if (connectionStatus === "connecting") {
    return (
      <Button
        className={props.className}
        size={props.size}
        asChild
        variant="outline"
      >
        <div>
          <Spinner className="size-4 shrink-0" />
          Connecting Wallet
        </div>
      </Button>
    );
  }

  if (!wallet || !chainId || !isLoggedIn) {
    return (
      <Button className={props.className} size={props.size} asChild>
        <Link
          href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
        >
          Connect Wallet
        </Link>
      </Button>
    );
  }

  const isBalanceRequired =
    !disableNoFundsPopup &&
    checkBalance &&
    (wallet.id === "smart" ? false : !GAS_FREE_CHAINS.includes(txChainId));

  const notEnoughBalance =
    (txChainBalance.data?.value || 0n) === 0n && isBalanceRequired;

  const disabled =
    buttonProps.disabled ||
    switchNetworkMutation.isPending ||
    // if user is about to trigger a transaction on txChain, but txChainBalance is not yet loaded and is required before proceeding
    (!showSwitchChainPopover && txChainBalance.isPending && isBalanceRequired);

  const showSpinner = isPending || switchNetworkMutation.isPending;
  const showNoFundsPopup = notEnoughBalance && !disableNoFundsPopup;

  return (
    <>
      <Popover
        open={isMismatchPopoverOpen}
        onOpenChange={(v) => {
          if (v) {
            if (showSwitchChainPopover) {
              setIsMismatchPopoverOpen(true);
            }
          } else {
            setIsMismatchPopoverOpen(false);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            {...buttonProps}
            className={cn("gap-2 disabled:opacity-100", buttonProps.className)}
            disabled={disabled}
            type={
              showSwitchChainPopover || showNoFundsPopup
                ? "button"
                : buttonProps.type
            }
            onClick={async (e) => {
              e.stopPropagation();

              if (showSwitchChainPopover) {
                eventRef.current = e;
                return;
              }

              if (notEnoughBalance && !props.disableNoFundsPopup) {
                // trackEvent({
                //   category: "no-funds",
                //   action: "popover",
                //   label: "evm",
                // });
                setDialog("no-funds");
                return;
              }

              // in case of in-app or smart wallet wallet, the user is not prompted to switch the network
              // we have to do it programmatically
              if (activeWalletChain?.id !== txChain?.id) {
                await switchNetworkMutation.mutateAsync(txChain);
              }

              if (buttonProps.onClick) {
                return buttonProps.onClick(e);
              }
            }}
            ref={ref}
          >
            {buttonProps.children}
            {showSpinner && <Spinner className="size-4 shrink-0" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[350px]" side="top" sideOffset={10}>
          <MismatchNotice
            txChainId={txChainId}
            onClose={(hasSwitched) => {
              if (hasSwitched) {
                setIsMismatchPopoverOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Not Enough Funds */}
      <Dialog
        open={!!dialog}
        onOpenChange={(v) => {
          if (!v) {
            setDialog(undefined);
          }
        }}
      >
        <DialogContent
          className={cn(
            "gap-0 p-0",
            dialog === "no-funds" && "md:!max-w-[480px]",
            dialog === "pay" && "md:!max-w-[360px] border-none bg-transparent",
          )}
          dialogCloseClassName="focus:ring-0"
        >
          <DynamicHeight>
            {dialog === "no-funds" && (
              <NoFundsDialogContent
                chain={txChain}
                openPayModal={() => {
                  // trackEvent({
                  //   category: "pay",
                  //   action: "buy",
                  //   label: "attempt",
                  // });
                  setDialog("pay");
                }}
                onCloseModal={() => setDialog(undefined)}
                isLoggedIn={props.isLoggedIn}
                client={props.client}
              />
            )}

            {dialog === "pay" && (
              <PayEmbed
                client={props.client}
                theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
                className="!w-auto"
                payOptions={{
                  // onPurchaseSuccess(info) {
                  //   if (
                  //     info?.type === "crypto" &&
                  //     info.status.status !== "NOT_FOUND"
                  //   ) {
                  //     trackEvent({
                  //       category: "pay",
                  //       action: "buy",
                  //       label: "success",
                  //       type: info.type,
                  //       chainId: info.status.quote.toToken.chainId,
                  //       tokenAddress: info.status.quote.toToken.tokenAddress,
                  //       amount: info.status.quote.toAmount,
                  //     });
                  //   }

                  //   if (
                  //     info?.type === "fiat" &&
                  //     info.status.status !== "NOT_FOUND"
                  //   ) {
                  //     trackEvent({
                  //       category: "pay",
                  //       action: "buy",
                  //       label: "success",
                  //       type: info.type,
                  //       chainId: info.status.quote.toToken.chainId,
                  //       tokenAddress: info.status.quote.toToken.tokenAddress,
                  //       amount: info.status.quote.estimatedToTokenAmount,
                  //     });
                  //   }
                  // },
                  prefillBuy: {
                    amount: "0.01",
                    chain: txChain,
                  },
                }}
              />
            )}
          </DynamicHeight>
        </DialogContent>
      </Dialog>
    </>
  );
});

MismatchButton.displayName = "MismatchButton";

async function fetchChainMetadata(chainId: number) {
  const res = await fetch(`https://api.thirdweb.com/v1/chains/${chainId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch chain metadata");
  }
  const json = (await res.json()) as { data: ChainMetadata };

  return json.data;
}

async function fetchChainServices(chainId: number) {
  const res = await fetch(
    `https://api.thirdweb.com/v1/chains/${chainId}/services`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch chain services");
  }
  const json = (await res.json()) as { data: ChainServices };
  return json.data;
}

function NoFundsDialogContent(props: {
  chain: Chain;
  openPayModal: () => void;
  onCloseModal: () => void;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const chainWithServiceInfoQuery = useQuery({
    queryKey: ["chain-with-services", props.chain.id],
    queryFn: async () => {
      const [chainRes, chainServicesRes] = await Promise.all([
        fetchChainMetadata(props.chain.id).catch(() => undefined),
        fetchChainServices(props.chain.id).catch(() => undefined),
      ]);

      if (!chainRes || !chainServicesRes) {
        throw new Error("Failed to fetch chain with services");
      }

      return {
        ...chainRes,
        services: chainServicesRes.services,
      } satisfies ChainMetadataWithServices;
    },
    enabled: !!props.chain.id,
  });

  return (
    <div className="flex flex-col gap-0 p-0">
      <div className="flex flex-col gap-6 p-6 ">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl tracking-tight">
            Not Enough Funds
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            You do not have enough funds to execute the transaction on this
            chain. Get more funds to continue
          </DialogDescription>
        </DialogHeader>

        {/* Get Funds content */}

        {!chainWithServiceInfoQuery.data ? (
          <div className="flex h-[300px] items-center justify-center">
            <Spinner className="size-10" />
          </div>
        ) : (
          <div>
            {props.chain.id === localhost.id ? (
              // localhost case
              <GetLocalHostTestnetFunds client={props.client} />
            ) : chainWithServiceInfoQuery.data.services.find(
                (x) => x.enabled && x.service === "pay",
              ) ? (
              // pay case
              <Button
                variant="primary"
                className="w-full"
                onClick={props.openPayModal}
              >
                Buy Funds
              </Button>
            ) : // no funds options available
            null}
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="flex justify-between gap-4 border-border border-t p-6">
        <Button variant="outline" onClick={props.onCloseModal}>
          Close
        </Button>

        <Button variant="outline" asChild>
          <Link
            href="https://portal.thirdweb.com/glossary/gas"
            target="_blank"
            className="gap-2"
          >
            Learn about Gas <ExternalLinkIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

const MismatchNotice: React.FC<{
  onClose: (hasSwitched: boolean) => void;
  txChainId: number;
}> = ({ onClose, txChainId }) => {
  const connectedChainId = useActiveWalletChain()?.id;
  const switchNetwork = useSwitchActiveWalletChain();
  const activeWallet = useActiveWallet();
  const actuallyCanAttemptSwitch =
    activeWallet && activeWallet.id !== "global.safe";
  const { idToChain } = useAllChainsData();
  const walletConnectedNetworkInfo = connectedChainId
    ? idToChain.get(connectedChainId)
    : undefined;

  const txChain = txChainId ? defineChain(txChainId) : undefined;
  const txChainMetadata = idToChain.get(txChainId);
  const switchNetworkMutation = useMutation({
    mutationFn: switchNetwork,
  });

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && txChain) {
      try {
        await switchNetworkMutation.mutateAsync(txChain);
        onClose(true);
      } catch {
        //  failed to switch network
        onClose(false);
      }
    }
  }, [actuallyCanAttemptSwitch, txChain, onClose, switchNetworkMutation]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-1 font-semibold text-base tracking-tight">
          Network Mismatch
        </h3>

        <p className="mb-1 text-muted-foreground text-sm">
          Your wallet is connected to the{" "}
          <span className="font-semibold capitalize">
            {walletConnectedNetworkInfo?.name ||
              `Chain ID #${connectedChainId}`}
          </span>{" "}
          network
        </p>

        <p className="text-muted-foreground text-sm">
          This action requires you to connect to the{" "}
          <span className="font-semibold capitalize">
            {txChainMetadata?.name || `Chain ID #${txChainId}`}
          </span>{" "}
          network.
        </p>
      </div>

      <Button
        size="sm"
        onClick={onSwitchWallet}
        disabled={!actuallyCanAttemptSwitch || switchNetworkMutation.isPending}
        variant="default"
        className="gap-2 capitalize disabled:opacity-100"
      >
        {switchNetworkMutation.isPending ? (
          <Spinner className="size-4 shrink-0" />
        ) : (
          <UnplugIcon className="size-4 shrink-0" />
        )}
        <span className="line-clamp-1 block truncate">
          {switchNetworkMutation.isPending ? "Switching" : "Switch"}{" "}
          {txChainMetadata ? `to ${txChainMetadata.name}` : "chain"}
        </span>
      </Button>

      {!actuallyCanAttemptSwitch && (
        <p className="text-muted-foreground">
          Your connected wallet does not support programmatic switching.
          <br />
          Please manually switch the network in your wallet.
        </p>
      )}
    </div>
  );
};

const GetLocalHostTestnetFunds = (props: { client: ThirdwebClient }) => {
  const address = useActiveAccount()?.address;
  const requestFunds = async () => {
    if (!address) {
      return toast.error("No active account detected");
    }
    const faucet = privateKeyToAccount({
      privateKey: LOCAL_NODE_PKEY,
      client: props.client,
    });
    const transaction = prepareTransaction({
      to: address,
      chain: localhost,
      client: props.client,
      value: toWei("10"),
    });
    const promise = sendTransaction({
      account: faucet,
      transaction,
    });
    toast.promise(promise, {
      error: "Failed to get funds from localhost",
      success: "Successfully got funds from localhost",
      loading: "Requesting funds",
    });
  };

  return (
    <Button variant="primary" onClick={requestFunds} className="w-full">
      Get Funds from Localhost
    </Button>
  );
};

function canSwitchNetworkWithoutConfirmation(wallet: Wallet) {
  return wallet.id === "inApp" || wallet.id === "smart";
}
