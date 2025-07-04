"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { shortenString } from "@/utils/usedapp-external";

export function LinkWalletPrompt(props: {
  email: string;
  accountAddress: string;
  onBack: () => void;
  requestLinkWallet: (email: string) => Promise<void>;
  onLinkWalletRequestSent: () => void;
}) {
  const requestLinkWallet = useMutation({
    mutationFn: props.requestLinkWallet,
  });

  function handleLinkWalletRequest() {
    requestLinkWallet.mutate(props.email, {
      onError: (err) => {
        const error = err as Error;
        console.error(error);
        toast.error("Failed to send link wallet request");
      },
      onSuccess: () => {
        props.onLinkWalletRequestSent();
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
            <UnderlineLink
              href="https://portal.thirdweb.com/account/billing/account-info"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more about wallet linking
            </UnderlineLink>
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
          className="gap-2 bg-card"
          disabled={requestLinkWallet.isPending}
          onClick={props.onBack}
          variant="outline"
        >
          <ArrowLeftIcon className="size-4" />
          Change Email
        </Button>

        <Button
          className="gap-2"
          disabled={requestLinkWallet.isPending}
          onClick={handleLinkWalletRequest}
          type="button"
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
