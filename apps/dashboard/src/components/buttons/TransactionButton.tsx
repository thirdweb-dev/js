"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CHAIN_ID_TO_GNOSIS } from "constants/mappings";
import { useActiveChainAsDashboardChain } from "lib/v5-adapter";
import { ArrowLeftRightIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import type { WalletId } from "thirdweb/wallets";
import { MismatchButton } from "./MismatchButton";

type ButtonProps = React.ComponentProps<typeof Button>;

type TransactionButtonProps = Omit<ButtonProps, "variant"> & {
  transactionCount: number | undefined; // support for unknown number of tx count
  isPending: boolean;
  isGasless?: boolean;
  txChainID: number;
  variant?: "destructive" | "primary";
};

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  children,
  transactionCount,
  isPending,
  isGasless,
  txChainID,
  variant,
  ...restButtonProps
}) => {
  const activeWallet = useActiveWallet();

  // all wallets except inApp (aka - embedded) requires external confirmation - either from mobile app or extension
  const walletRequiresExternalConfirmation =
    activeWallet &&
    activeWallet.id !== "inApp" &&
    activeWallet.id !== "embedded";

  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const chain = useActiveChainAsDashboardChain();
  const isChainDeprecated = useMemo(
    () => chain?.status === "deprecated",
    [chain],
  );

  const ButtonComponent = useMemo(() => {
    return isGasless ? Button : MismatchButton;
  }, [isGasless]);

  const txCountDivWidth = 60;
  const disabled = isChainDeprecated || restButtonProps.disabled || isPending;

  return (
    <Popover open={walletRequiresExternalConfirmation && isPending}>
      <PopoverTrigger asChild>
        <ButtonComponent
          variant={variant || "primary"}
          desiredChainId={txChainID}
          {...restButtonProps}
          disabled={disabled}
          className={cn("relative overflow-hidden", restButtonProps.className)}
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

          <span className="flex grow items-center justify-center gap-3">
            {children}
            {isPending && <Spinner className="size-4" />}
          </span>
        </ButtonComponent>
      </PopoverTrigger>

      <PopoverContent className="min-w-[300px]" sideOffset={10} side="top">
        <ExternalApprovalNotice
          walletId={activeWallet?.id}
          initialFocusRef={initialFocusRef}
        />
      </PopoverContent>
    </Popover>
  );
};

interface ExternalApprovalNoticeProps {
  walletId?: WalletId;
  initialFocusRef: React.RefObject<HTMLButtonElement | null>;
}

const ExternalApprovalNotice: React.FC<ExternalApprovalNoticeProps> = ({
  walletId,
  initialFocusRef,
}) => {
  const address = useActiveAccount()?.address;
  const chainId = useActiveWalletChain()?.id || -1;
  const [showHint, setShowHint] = useState(false);

  // legitimate usecase!
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const t = setTimeout(() => {
      setShowHint(true);
    }, 15_000);
    return () => clearTimeout(t);
  }, []);

  if (walletId === "global.safe") {
    const isChainIdSupported = chainId in CHAIN_ID_TO_GNOSIS;
    return (
      <div className="flex flex-col gap-2">
        <h4 className="text-foreground">Execute Transaction</h4>

        <p className="text-muted-foreground text-sm">
          You will need to execute this transaction in your Safe to continue.
        </p>

        {showHint && (
          <p className="text-muted-foreground text-sm">
            Once you have approved and executed the transaction in your Gnosis
            Safe this action will continue automatically.
          </p>
        )}

        {isChainIdSupported && (
          <Button
            ref={initialFocusRef}
            asChild
            size="sm"
            className="mt-2 gap-2"
          >
            <Link
              href={`https://app.safe.global/${
                CHAIN_ID_TO_GNOSIS[chainId as keyof typeof CHAIN_ID_TO_GNOSIS]
              }:${address}/transactions/queue`}
              target="_blank"
            >
              Go To Safe <ExternalLinkIcon className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-foreground">Approve Transaction</h4>

      <p className="text-muted-foreground text-sm">
        You will need to approve this transaction in your connected wallet.
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
