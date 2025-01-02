"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { doLogout } from "../auth-actions";
import { AccountForm } from "./AccountForm";
import { TitleAndDescription } from "./Title";

type OnboardingGeneralProps = {
  account: Account;
  onSave: (email: string) => void;
  onDuplicate: (email: string) => void;
};

export const OnboardingGeneral: React.FC<OnboardingGeneralProps> = ({
  account,
  onSave,
  onDuplicate,
}) => {
  const [existing, setExisting] = useState(false);
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  async function handleLogout() {
    await doLogout();
    if (activeWallet) {
      disconnect(activeWallet);
    }
  }

  const logoutMutation = useMutation({
    mutationFn: handleLogout,
  });

  return (
    <div>
      <TitleAndDescription
        heading={
          !existing
            ? "Create your thirdweb account"
            : "Log in to your thirdweb account"
        }
        description="Start building web3 apps and games, faster."
      />

      <div className="h-6" />

      <div className="flex flex-col gap-4">
        <AccountForm
          showSubscription={!existing}
          hideName={existing}
          account={account}
          buttonText={!existing ? "Get Started for Free" : "Login"}
          trackingCategory="onboarding"
          onSave={onSave}
          onDuplicateError={onDuplicate}
        />

        {!existing ? (
          <>
            <Button variant="primary" onClick={() => setExisting(true)}>
              I have a thirdweb account
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logoutMutation.mutate();
              }}
              className="gap-2"
            >
              {logoutMutation.isPending && <Spinner className="size-4" />}
              Log out
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => setExisting(false)}>
            I don&apos;t have an account
          </Button>
        )}
      </div>
    </div>
  );
};
