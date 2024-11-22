"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useUpdateAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useTrack } from "hooks/analytics/useTrack";
import { shortenString } from "utils/usedapp-external";
import { TitleAndDescription } from "./Title";

interface OnboardingLinkWalletProps {
  email: string;
  onSave: () => void;
  onBack: () => void;
}

export const OnboardingLinkWallet: React.FC<OnboardingLinkWalletProps> = ({
  email,
  onSave,
  onBack,
}) => {
  const { user } = useLoggedInUser();
  const trackEvent = useTrack();
  const updateMutation = useUpdateAccount();

  const handleSubmit = () => {
    trackEvent({
      category: "account",
      action: "linkWallet",
      label: "attempt",
      data: {
        email,
      },
    });

    updateMutation.mutate(
      {
        email,
        linkWallet: true,
      },
      {
        onSuccess: (data) => {
          if (onSave) {
            onSave();
          }

          trackEvent({
            category: "account",
            action: "linkWallet",
            label: "success",
            data,
          });
        },
        onError: (err) => {
          const error = err as Error;

          trackEvent({
            category: "account",
            action: "linkWallet",
            label: "error",
            error,
          });
        },
      },
    );
  };

  return (
    <>
      <TitleAndDescription
        heading="Linking Wallets"
        description={
          <>
            We&apos;ve noticed that there is another account associated with{" "}
            <span className="text-foreground">{email}</span>. Would you like to
            link your wallet{" "}
            <span className="font-mono text-foreground">
              {shortenString(user?.address ?? "")}
            </span>{" "}
            to the existing account?
            <div className="h-2" />
            Once you agree, we will email you the details.{" "}
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

      <form>
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            {updateMutation.isPending && <Spinner className="size-4" />}
            {updateMutation.isPending ? "Linking" : "Yes, link them"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onBack}
            disabled={updateMutation.isPending}
          >
            Use another email
          </Button>
        </div>
      </form>
    </>
  );
};
