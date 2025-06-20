"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { FaucetButton } from "app/(app)/(dashboard)/(chain)/[chain_id]/(chainPage)/components/client/FaucetButton";
import { GiftIcon } from "app/(app)/(dashboard)/(chain)/[chain_id]/(chainPage)/components/icons/GiftIcon";
import type {
  ChainMetadataWithServices,
  ChainServices,
} from "app/(app)/(dashboard)/(chain)/types/chain";
import { getSDKTheme } from "app/(app)/components/sdk-component-theme";
import { LOCAL_NODE_PKEY } from "constants/misc";
import { useAllChainsData } from "hooks/chains/allChains";
import { ExternalLinkIcon, UnplugIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type React from "react";
import { forwardRef, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import {
  prepareTransaction,
  sendTransaction,
  type ThirdwebClient,
  toWei,
} from "thirdweb";
import { type Chain, type ChainMetadata, localhost } from "thirdweb/chains";
import {
  PayEmbed,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useSwitchActiveWalletChain,
  useWalletBalance,
} from "thirdweb/react";
import { privateKeyToAccount, type Wallet } from "thirdweb/wallets";
import { apiServerProxy } from "@/actions/proxies";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
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
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { cn } from "@/lib/utils";
import { getFaucetClaimAmount } from "../../app/(app)/api/testnet-faucet/claim/claim-amount";
import { useV5DashboardChain } from "../../lib/v5-adapter";

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
  const txChain = useV5DashboardChain(txChainId);
  const connectionStatus = useActiveWalletConnectionStatus();

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

  const chainId = activeWalletChain?.id;

  const switchNetworkMutation = useMutation({
    mutationFn: switchNetwork,
  });

  const eventRef =
    useRef<React.MouseEvent<HTMLButtonElement, MouseEvent>>(undefined);

  if (connectionStatus === "connecting") {
    return (
      <Button
        asChild
        className={props.className}
        size={props.size}
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
      <Button asChild className={props.className} size={props.size}>
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
        onOpenChange={(v) => {
          if (v) {
            if (showSwitchChainPopover) {
              setIsMismatchPopoverOpen(true);
            }
          } else {
            setIsMismatchPopoverOpen(false);
          }
        }}
        open={isMismatchPopoverOpen}
      >
        <PopoverTrigger asChild>
          <Button
            {...buttonProps}
            className={cn("gap-2 disabled:opacity-100", buttonProps.className)}
            disabled={disabled}
            onClick={async (e) => {
              e.stopPropagation();

              if (showSwitchChainPopover) {
                eventRef.current = e;
                return;
              }

              if (notEnoughBalance && !props.disableNoFundsPopup) {
                setDialog("no-funds");
                return;
              }

              // in case of in-app or smart wallet wallet, the user is not prompted to switch the network
              // we have to do it programmatically
              if (activeWalletChain?.id !== txChain.id) {
                await switchNetworkMutation.mutateAsync(txChain);
              }

              if (buttonProps.onClick) {
                return buttonProps.onClick(e);
              }
            }}
            ref={ref}
            type={
              showSwitchChainPopover || showNoFundsPopup
                ? "button"
                : buttonProps.type
            }
          >
            {buttonProps.children}
            {showSpinner && <Spinner className="size-4 shrink-0" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[350px]" side="top" sideOffset={10}>
          <MismatchNotice
            onClose={(hasSwitched) => {
              if (hasSwitched) {
                setIsMismatchPopoverOpen(false);
              }
            }}
            txChainId={txChainId}
          />
        </PopoverContent>
      </Popover>

      {/* Not Enough Funds */}
      <Dialog
        onOpenChange={(v) => {
          if (!v) {
            setDialog(undefined);
          }
        }}
        open={!!dialog}
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
                client={props.client}
                isLoggedIn={props.isLoggedIn}
                onCloseModal={() => setDialog(undefined)}
                openPayModal={() => {
                  setDialog("pay");
                }}
              />
            )}

            {dialog === "pay" && (
              <PayEmbed
                className="!w-auto"
                client={props.client}
                payOptions={{
                  prefillBuy: {
                    amount: "0.01",
                    chain: txChain,
                  },
                }}
                theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
              />
            )}
          </DynamicHeight>
        </DialogContent>
      </Dialog>
    </>
  );
});

MismatchButton.displayName = "MismatchButton";

function NoFundsDialogContent(props: {
  chain: Chain;
  openPayModal: () => void;
  onCloseModal: () => void;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const chainWithServiceInfoQuery = useQuery({
    enabled: !!props.chain.id,
    queryFn: async () => {
      const [chainRes, chainServicesRes] = await Promise.all([
        apiServerProxy<{ data: ChainMetadata }>({
          method: "GET",
          pathname: `/v1/chains/${props.chain.id}`,
        }),
        apiServerProxy<{ data: ChainServices }>({
          method: "GET",
          pathname: `/v1/chains/${props.chain.id}/services`,
        }),
      ]);

      if (!chainRes.ok || !chainServicesRes.ok) {
        throw new Error("Failed to fetch chain with services");
      }

      return {
        ...chainRes.data.data,
        services: chainServicesRes.data.data.services,
      } satisfies ChainMetadataWithServices;
    },
    queryKey: ["chain-with-services", props.chain.id],
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
            ) : chainWithServiceInfoQuery.data.testnet ? (
              // faucet case
              <GetFundsFromFaucet
                chain={chainWithServiceInfoQuery.data}
                client={props.client}
                isLoggedIn={props.isLoggedIn}
              />
            ) : chainWithServiceInfoQuery.data.services.find(
                (x) => x.enabled && x.service === "pay",
              ) ? (
              // pay case
              <Button
                className="w-full"
                onClick={props.openPayModal}
                variant="primary"
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
        <Button onClick={props.onCloseModal} variant="outline">
          Close
        </Button>

        <Button asChild variant="outline">
          <Link
            className="gap-2"
            href="https://portal.thirdweb.com/glossary/gas"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn about Gas <ExternalLinkIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function GetFundsFromFaucet(props: {
  chain: ChainMetadata;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const amountToGive = getFaucetClaimAmount(props.chain.chainId);

  return (
    <div className="flex justify-center rounded-lg border border-border px-4 py-6">
      <div className="flex w-full flex-col items-center">
        <div className="flex items-center">
          <GiftIcon bg="hsl(var(--background))" className="size-12" />
        </div>

        <div className="h-3" />

        <h2 className="px-4 text-center font-semibold text-lg tracking-tight">
          Get Testnet Funds
        </h2>

        <div className="h-3" />

        <p className="text-center text-muted-foreground text-sm">
          A testnet faucet is an online service that provides free testnet
          currency to web3 app and blockchain developers. This allows them to
          experiment with and test smart contracts and decentralized
          applications (dApps) on EVM testnets without using real
          cryptocurrency.
        </p>

        <div className="h-6" />

        <FaucetButton
          amount={amountToGive}
          chain={props.chain}
          client={props.client}
          isLoggedIn={props.isLoggedIn}
        />
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

  const txChain = txChainId ? idToChain.get(txChainId) : undefined;
  const chainV5 = useV5DashboardChain(txChainId);
  const switchNetworkMutation = useMutation({
    mutationFn: switchNetwork,
  });

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && txChainId && chainV5) {
      try {
        await switchNetworkMutation.mutateAsync(chainV5);
        onClose(true);
      } catch {
        //  failed to switch network
        onClose(false);
      }
    }
  }, [
    chainV5,
    actuallyCanAttemptSwitch,
    txChainId,
    onClose,
    switchNetworkMutation,
  ]);

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
            {txChain?.name || `Chain ID #${txChainId}`}
          </span>{" "}
          network.
        </p>
      </div>

      <Button
        className="gap-2 capitalize disabled:opacity-100"
        disabled={!actuallyCanAttemptSwitch || switchNetworkMutation.isPending}
        onClick={onSwitchWallet}
        size="sm"
        variant="default"
      >
        {switchNetworkMutation.isPending ? (
          <Spinner className="size-4 shrink-0" />
        ) : (
          <UnplugIcon className="size-4 shrink-0" />
        )}
        <span className="line-clamp-1 block truncate">
          {switchNetworkMutation.isPending ? "Switching" : "Switch"}{" "}
          {txChain ? `to ${txChain.name}` : "chain"}
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
      client: props.client,
      privateKey: LOCAL_NODE_PKEY,
    });
    const transaction = prepareTransaction({
      chain: localhost,
      client: props.client,
      to: address,
      value: toWei("10"),
    });
    const promise = sendTransaction({
      account: faucet,
      transaction,
    });
    toast.promise(promise, {
      error: "Failed to get funds from localhost",
      loading: "Requesting funds",
      success: "Successfully got funds from localhost",
    });
  };

  return (
    <Button className="w-full" onClick={requestFunds} variant="primary">
      Get Funds from Localhost
    </Button>
  );
};

function canSwitchNetworkWithoutConfirmation(wallet: Wallet) {
  return wallet.id === "inApp" || wallet.id === "smart";
}
