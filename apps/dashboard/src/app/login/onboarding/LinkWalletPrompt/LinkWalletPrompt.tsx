"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import { shortenString } from "utils/usedapp-external";
import type { TrackingParams } from "../../../../hooks/analytics/useTrack";

export function LinkWalletPrompt(props: {
  email: string;
  accountAddress: string;
  onBack: () => void;
  requestLinkWallet: (email: string) => Promise<void>;
  trackEvent: (params: TrackingParams) => void;
  onLinkWalletRequestSent: () => void;
}) {
  const requestLinkWallet = useMutation({
    mutationFn: props.requestLinkWallet,
  });

  function handleLinkWalletRequest() {
    props.trackEvent({
      category: "account",
      action: "linkWallet",
      label: "attempt",
      data: {
        email: props.email,
      },
    });

    requestLinkWallet.mutate(props.email, {
      onSuccess: (data) => {
        props.onLinkWalletRequestSent();
        props.trackEvent({
          category: "account",
          action: "linkWallet",
          label: "success",
          data,
        });
      },
      onError: (err) => {
        const error = err as Error;
        console.error(error);
        toast.error("Failed to send link wallet request");
        props.trackEvent({
          category: "account",
          action: "linkWallet",
          label: "error",
          error,
        });
      },
    });
  }

  return (
    <div className="rounded-lg border bg-card">
      <h3 className="border-b px-4 py-6 font-semibold text-xl tracking-tight lg:p-6">
        Link your wallet
      </h3>

      <div className="p-4 lg:p-6">
        <div className="mb-6 space-y-2 text-muted-foreground">
          <p>
            An account with{" "}
            <span className="text-foreground">{props.email}</span> already
            exists, but your wallet is not linked to that account.
          </p>

          <p>
            You can link your wallet with this account to access it. <br />{" "}
            Multiple wallets can be linked to the same account.{" "}
            <TrackedLinkTW
              href="https://portal.thirdweb.com/account/billing/account-info"
              category="account"
              label="learn-wallet-linking"
              target="_blank"
              className="underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:text-foreground hover:decoration-foreground hover:decoration-solid"
            >
              Learn more about wallet linking
            </TrackedLinkTW>
          </p>
        </div>

        <p className="text-foreground">
          Would you like to link your wallet{" "}
          <span className="font-mono text-sm tracking-tight">
            ({shortenString(props.accountAddress)})
          </span>{" "}
          with this account?
        </p>
      </div>

      <div className="flex flex-col-reverse gap-4 border-t px-4 py-6 md:flex-row lg:justify-between lg:p-6">
        <Button
          variant="outline"
          className="gap-2 bg-card"
          onClick={props.onBack}
          disabled={requestLinkWallet.isPending}
        >
          <ArrowLeftIcon className="size-4" />
          Change Email
        </Button>

        <Button
          type="button"
          onClick={handleLinkWalletRequest}
          disabled={requestLinkWallet.isPending}
          className="gap-2"
        >
          Link wallet and continue
          {requestLinkWallet.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <ArrowRightIcon className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
