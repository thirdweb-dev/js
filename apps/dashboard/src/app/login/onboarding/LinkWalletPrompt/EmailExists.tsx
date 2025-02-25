"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { shortenString } from "utils/usedapp-external";
import type { TrackingParams } from "../../../../hooks/analytics/useTrack";
import { TitleAndDescription } from "../Title";

export function EmailExists(props: {
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
    <div>
      <TitleAndDescription
        heading="Email already in use"
        description={
          <>
            {`We've`} noticed that an account associated with{" "}
            <span className="text-foreground">{props.email}</span> already
            exists.
            <br /> Would you like to link your wallet{" "}
            <span className="font-mono text-foreground text-sm">
              {shortenString(props.accountAddress)}
            </span>{" "}
            to the existing account?
            <div className="h-2" />
            <TrackedLinkTW
              href="https://portal.thirdweb.com/account/billing/account-info"
              category="account"
              label="learn-wallet-linking"
              target="_blank"
              className="underline hover:text-foreground"
            >
              Learn more about wallet linking
            </TrackedLinkTW>
            .
          </>
        }
      />

      <div className="h-8" />

      <div className="flex flex-row gap-3">
        <Button
          variant="outline"
          className="gap-2 bg-card"
          onClick={props.onBack}
          disabled={requestLinkWallet.isPending}
        >
          <ArrowLeftIcon className="size-4" />
          Use another email
        </Button>

        <Button
          type="button"
          onClick={handleLinkWalletRequest}
          disabled={requestLinkWallet.isPending}
          className="gap-2"
        >
          {requestLinkWallet.isPending && <Spinner className="size-4" />}
          {requestLinkWallet.isPending ? "Linking" : "Yes, link them"}
        </Button>
      </div>
    </div>
  );
}
