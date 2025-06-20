"use client";
import { ArrowLeftRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  useActiveWallet,
  useActiveWalletChain,
  useConnectedWallets,
} from "thirdweb/react";
import type { Wallet } from "thirdweb/wallets";
import type { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useAllChainsData } from "@/hooks/chains";
import { cn } from "@/lib/utils";
import { MismatchButton } from "./MismatchButton";

type ButtonProps = React.ComponentProps<typeof Button>;

type TransactionButtonProps = Omit<ButtonProps, "variant"> & {
  transactionCount: number | undefined; // support for unknown number of tx count
  isPending: boolean;
  txChainID: number;
  variant?: "destructive" | "primary" | "default";
  isLoggedIn: boolean;
  checkBalance?: boolean;
  client: ThirdwebClient;
  disableNoFundsPopup?: boolean;
};

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  children,
  transactionCount,
  isPending,
  txChainID,
  variant,
  isLoggedIn,
  checkBalance,
  client,
  disableNoFundsPopup,
  ...restButtonProps
}) => {
  const activeWallet = useActiveWallet();
  const connectedWallets = useConnectedWallets();
  // all wallets except inApp (aka - embedded) requires external confirmation - either from mobile app or extension
  const walletRequiresExternalConfirmation =
    activeWallet &&
    !canSendTransactionWithoutConfirmation(activeWallet, connectedWallets);

  const chain = useActiveWalletChain();

  const { idToChain } = useAllChainsData();
  const activeChainMeta = chain ? idToChain.get(chain.id) : undefined;

  const isChainDeprecated = useMemo(
    () => activeChainMeta?.status === "deprecated",
    [activeChainMeta],
  );

  const txCountDivWidth = 60;
  const disabled = isChainDeprecated || restButtonProps.disabled || isPending;

  return (
    <Popover open={walletRequiresExternalConfirmation && isPending}>
      <PopoverTrigger asChild>
        <MismatchButton
          client={client}
          disableNoFundsPopup={
            disableNoFundsPopup === undefined ? false : disableNoFundsPopup
          }
          isLoggedIn={isLoggedIn}
          isPending={isPending}
          txChainId={txChainID}
          variant={variant || "primary"}
          {...restButtonProps}
          checkBalance={checkBalance}
          className={cn("relative overflow-hidden", restButtonProps.className)}
          disabled={disabled}
          style={{
            paddingLeft: transactionCount
              ? `${txCountDivWidth + 16}px`
              : undefined,
            ...restButtonProps.style,
          }}
        >
          {transactionCount && (
            <ToolTipLabel
              label={
                disabled
                  ? undefined
                  : isChainDeprecated
                    ? "This chain is deprecated so you cannot execute transactions on it"
                    : `This action will trigger ${transactionCount} ${transactionCount > 1 ? "transactions" : "transaction"}`
              }
            >
              <div
                className="absolute top-0 bottom-0 left-0 flex items-center justify-center gap-1 bg-black/30"
                style={{
                  width: `${txCountDivWidth}px`,
                }}
              >
                <span className="font-medium font-mono">
                  {transactionCount}
                </span>
                <ArrowLeftRightIcon className="size-3" />
              </div>
            </ToolTipLabel>
          )}

          <span className="flex grow items-center justify-center gap-2">
            {children}
          </span>
        </MismatchButton>
      </PopoverTrigger>

      <PopoverContent className="min-w-[300px]" side="top" sideOffset={10}>
        <ExternalApprovalNotice />
      </PopoverContent>
    </Popover>
  );
};

const ExternalApprovalNotice: React.FC = () => {
  const [showHint, setShowHint] = useState(false);

  // legitimate usecase!
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const t = setTimeout(() => {
      setShowHint(true);
    }, 15_000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-foreground">Approve Transaction</h4>

      <p className="text-muted-foreground text-sm">
        Your connected wallet will prompt you to approve this transaction
      </p>

      {showHint && (
        <p className="text-muted-foreground text-sm">
          Once you have approved the transaction in your connected wallet this
          action will continue automatically.
        </p>
      )}
    </div>
  );
};

function canSendTransactionWithoutConfirmation(
  wallet: Wallet,
  connectedWallets: Wallet[],
) {
  // inApp wallet
  if (wallet.id === "inApp") {
    return true;
  }

  // smart wallet + inApp admin wallet
  if (wallet.id === "smart") {
    const adminWallet = connectedWallets.find(
      (w) => w.getAccount()?.address === wallet.getAdminAccount?.()?.address,
    );
    return adminWallet?.id === "inApp";
  }

  return false;
}
