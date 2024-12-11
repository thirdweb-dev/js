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
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { cn } from "@/lib/utils";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaucetButton } from "app/(dashboard)/(chain)/[chain_id]/(chainPage)/components/client/FaucetButton";
import { GiftIcon } from "app/(dashboard)/(chain)/[chain_id]/(chainPage)/components/icons/GiftIcon";
import type {
  ChainMetadataWithServices,
  ChainServices,
} from "app/(dashboard)/(chain)/types/chain";
import { getSDKTheme } from "app/components/sdk-component-theme";
import { LOCAL_NODE_PKEY } from "constants/misc";
import { useTrack } from "hooks/analytics/useTrack";
import { ExternalLinkIcon, UnplugIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { forwardRef, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { prepareTransaction, sendTransaction, toWei } from "thirdweb";
import { type Chain, type ChainMetadata, localhost } from "thirdweb/chains";
import {
  PayEmbed,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
  useWalletBalance,
} from "thirdweb/react";
import { privateKeyToAccount } from "thirdweb/wallets";
import { getFaucetClaimAmount } from "../../app/api/testnet-faucet/claim/claim-amount";
import { THIRDWEB_API_HOST } from "../../constants/urls";
import { useAllChainsData } from "../../hooks/chains/allChains";
import { useV5DashboardChain } from "../../lib/v5-adapter";

const GAS_FREE_CHAINS = [
  75513, // Geek verse testnet
  75512, // Geek verse mainnet
  531050104, // sophon testnet
  37111, // lens sepolia
  4457845, // zero testnet
  978658, // treasure topaz
  300, // zksync sepolia
];

function useNetworkMismatchAdapter(desiredChainId: number) {
  const walletChainId = useActiveWalletChain()?.id;
  if (!walletChainId) {
    // simply not ready yet, assume false
    return false;
  }
  // otherwise, compare the chain ids
  return walletChainId !== desiredChainId;
}

type MistmatchButtonProps = React.ComponentProps<typeof Button> & {
  desiredChainId: number;
  twAccount: Account | undefined;
};

export const MismatchButton = forwardRef<
  HTMLButtonElement,
  MistmatchButtonProps
>((props, ref) => {
  const { desiredChainId, twAccount, ...buttonProps } = props;
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const activeWalletChain = useActiveWalletChain();
  const [dialog, setDialog] = useState<undefined | "no-funds" | "pay">();
  const { theme } = useTheme();
  const client = useThirdwebClient();
  const pathname = usePathname();

  const evmBalance = useWalletBalance({
    address: account?.address,
    chain: activeWalletChain,
    client,
  });

  const networksMismatch = useNetworkMismatchAdapter(desiredChainId);
  const [isMismatchPopoverOpen, setIsMismatchPopoverOpen] = useState(false);
  const trackEvent = useTrack();

  const chainId = activeWalletChain?.id;

  const eventRef =
    useRef<React.MouseEvent<HTMLButtonElement, MouseEvent>>(undefined);

  if (!twAccount) {
    return (
      <Button className={props.className} size={props.size} asChild>
        <Link
          href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
        >
          Sign in
        </Link>
      </Button>
    );
  }

  if (!wallet || !chainId) {
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
  const notEnoughBalance =
    (evmBalance.data?.value || 0n) === 0n && !GAS_FREE_CHAINS.includes(chainId);

  return (
    <>
      <Popover
        open={isMismatchPopoverOpen}
        onOpenChange={(v) => {
          if (v) {
            if (networksMismatch) {
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
            type={
              networksMismatch || notEnoughBalance ? "button" : buttonProps.type
            }
            onClick={(e) => {
              e.stopPropagation();

              if (networksMismatch) {
                eventRef.current = e;
                return;
              }

              if (notEnoughBalance) {
                trackEvent({
                  category: "no-funds",
                  action: "popover",
                  label: "evm",
                });
                setDialog("no-funds");
                return;
              }

              if (buttonProps.onClick) {
                return buttonProps.onClick(e);
              }
            }}
            ref={ref}
          >
            {buttonProps.children}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[350px]" side="top" sideOffset={10}>
          <MismatchNotice
            desiredChainId={desiredChainId}
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
            "z-[10001] gap-0 p-0",
            dialog === "no-funds" && "max-w-[480px]",
            dialog === "pay" && "max-w-[360px] border-none bg-transparent",
          )}
          dialogOverlayClassName="z-[10000]"
          dialogCloseClassName="focus:ring-0"
        >
          <DynamicHeight>
            {dialog === "no-funds" && twAccount && (
              <NoFundsDialogContent
                chain={activeWalletChain}
                openPayModal={() => {
                  trackEvent({
                    category: "pay",
                    action: "buy",
                    label: "attempt",
                  });
                  setDialog("pay");
                }}
                onCloseModal={() => setDialog(undefined)}
                twAccount={twAccount}
              />
            )}

            {dialog === "pay" && (
              <PayEmbed
                client={client}
                theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
                className="!w-auto"
                payOptions={{
                  onPurchaseSuccess(info) {
                    if (
                      info.type === "crypto" &&
                      info.status.status !== "NOT_FOUND"
                    ) {
                      trackEvent({
                        category: "pay",
                        action: "buy",
                        label: "success",
                        type: info.type,
                        chainId: info.status.quote.toToken.chainId,
                        tokenAddress: info.status.quote.toToken.tokenAddress,
                        amount: info.status.quote.toAmount,
                      });
                    }

                    if (
                      info.type === "fiat" &&
                      info.status.status !== "NOT_FOUND"
                    ) {
                      trackEvent({
                        category: "pay",
                        action: "buy",
                        label: "success",
                        type: info.type,
                        chainId: info.status.quote.toToken.chainId,
                        tokenAddress: info.status.quote.toToken.tokenAddress,
                        amount: info.status.quote.estimatedToTokenAmount,
                      });
                    }
                  },
                  prefillBuy: {
                    chain: activeWalletChain,
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

function NoFundsDialogContent(props: {
  chain: Chain;
  openPayModal: () => void;
  onCloseModal: () => void;
  twAccount: Account;
}) {
  const chainWithServiceInfoQuery = useQuery({
    queryKey: ["chain-with-services", props.chain.id],
    queryFn: async () => {
      const [chain, chainServices] = await Promise.all([
        fetch(`${THIRDWEB_API_HOST}/v1/chains/${props.chain.id}`).then((res) =>
          res.json(),
        ) as Promise<{ data: ChainMetadata }>,
        fetch(`${THIRDWEB_API_HOST}/v1/chains/${props.chain.id}/services`).then(
          (res) => res.json(),
        ) as Promise<{ data: ChainServices }>,
      ]);

      return {
        ...chain.data,
        services: chainServices.data.services,
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
              <GetLocalHostTestnetFunds />
            ) : chainWithServiceInfoQuery.data.testnet ? (
              // faucet case
              <GetFundsFromFaucet
                twAccount={props.twAccount}
                chain={chainWithServiceInfoQuery.data}
              />
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

function GetFundsFromFaucet(props: {
  chain: ChainMetadata;
  twAccount: Account;
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
          chain={props.chain}
          amount={amountToGive}
          twAccount={props.twAccount}
        />
      </div>
    </div>
  );
}

const MismatchNotice: React.FC<{
  onClose: (hasSwitched: boolean) => void;
  desiredChainId: number;
}> = ({ onClose, desiredChainId }) => {
  const connectedChainId = useActiveWalletChain()?.id;
  const switchNetwork = useSwitchActiveWalletChain();
  const activeWallet = useActiveWallet();
  const actuallyCanAttemptSwitch =
    activeWallet && activeWallet.id !== "global.safe";
  const { idToChain } = useAllChainsData();
  const walletConnectedNetworkInfo = connectedChainId
    ? idToChain.get(connectedChainId)
    : undefined;
  const chain = desiredChainId ? idToChain.get(desiredChainId) : undefined;
  const chainV5 = useV5DashboardChain(desiredChainId);
  const switchNetworkMutation = useMutation({
    mutationFn: switchNetwork,
  });

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && desiredChainId && chainV5) {
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
    desiredChainId,
    onClose,
    switchNetworkMutation,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-1 font-semibold text-lg tracking-tight">
          Network Mismatch
        </h3>

        <p className="text-muted-foreground">
          Your wallet is connected to the{" "}
          <span className="font-medium capitalize">
            {walletConnectedNetworkInfo?.name ||
              `Chain ID #${connectedChainId}`}
          </span>{" "}
          network but this action requires you to connect to the{" "}
          <span className="font-medium capitalize">
            {chain?.name || `Chain ID #${desiredChainId}`}
          </span>{" "}
          network.
        </p>
      </div>

      <Button
        size="sm"
        onClick={onSwitchWallet}
        disabled={!actuallyCanAttemptSwitch}
        variant="primary"
        className="gap-2 capitalize"
      >
        {switchNetworkMutation.isPending ? (
          <Spinner className="size-4 shrink-0" />
        ) : (
          <UnplugIcon className="size-4 shrink-0" />
        )}
        <span className="line-clamp-1 block truncate">
          Switch {chain ? `to ${chain.name}` : "chain"}
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

const GetLocalHostTestnetFunds: React.FC = () => {
  const address = useActiveAccount()?.address;
  const client = useThirdwebClient();
  const requestFunds = async () => {
    if (!address) {
      return toast.error("No active account detected");
    }
    const faucet = privateKeyToAccount({
      privateKey: LOCAL_NODE_PKEY,
      client,
    });
    const transaction = prepareTransaction({
      to: address,
      chain: localhost,
      client,
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
