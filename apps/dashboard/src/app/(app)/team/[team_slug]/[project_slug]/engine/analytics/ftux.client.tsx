"use client";
import type { Project } from "@/api/projects";
import { type Step, StepsCard } from "components/dashboard/StepsCard";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "../../../../../../../@/components/ui/button";
import CreateServerWallet from "../server-wallets/components/create-server-wallet.client";
import type { Wallet } from "../server-wallets/wallet-table/types";
import CreateVaultAccountButton from "../vault/components/create-vault-account.client";
import { SendTestTransaction } from "./send-test-tx.client";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { maskSecret } from "../lib/vault.client";

interface Props {
  managementAccessToken: string | undefined;
  project: Project;
  wallets: Wallet[];
  hasTransactions: boolean;
}

export const EngineChecklist: React.FC<Props> = (props) => {
  const [userAccessToken, setUserAccessToken] = useState<string | undefined>();

  const finalSteps = useMemo(() => {
    const steps: Step[] = [];
    steps.push({
      title: "Create a Vault Admin Account",
      description:
        "Your Vault admin account will be used to create server wallets and manage access tokens.",
      children: (
        <CreateVaultAccountStep
          project={props.project}
          onUserAccessTokenCreated={(token) => setUserAccessToken(token)}
        />
      ),
      completed: !!props.managementAccessToken,
      showCompletedChildren: false,
    });
    steps.push({
      title: "Create a Server Wallet",
      description:
        "Your server wallet will be used to send transactions to Engine.",
      children: (
        <CreateServerWalletStep
          project={props.project}
          managementAccessToken={props.managementAccessToken}
        />
      ),
      completed: props.wallets.length > 0,
      showIncompleteChildren: false,
      showCompletedChildren: false,
    });
    steps.push({
      title: "Send a Test Transaction",
      description: "Send a test transaction to see Engine in action.",
      children: (
        <>
          <div className="w-full py-4">
            {userAccessToken && (
              <div className="flex flex-col gap-2 ">
                <CopyTextButton
                  textToCopy={userAccessToken}
                  className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                  textToShow={maskSecret(userAccessToken)}
                  copyIconPosition="right"
                  tooltip="Copy Vault Access Token"
                />
                <p className="text-muted-foreground text-xs">
                  This is the access token you just created. You need it to
                  authorize every wallet action. You can create more access
                  tokens with your admin key. Each access token can be scoped
                  and permissioned with flexible policies. You can copy this one
                  now to send a test transaction.
                </p>
              </div>
            )}
          </div>
          <SendTestTransaction
            wallets={props.wallets}
            project={props.project}
          />
        </>
      ),
      completed: props.hasTransactions,
      showIncompleteChildren: true,
      showCompletedChildren: false,
    });
    return steps;
  }, [
    props.managementAccessToken,
    props.project,
    props.wallets,
    props.hasTransactions,
    userAccessToken,
  ]);

  if (finalSteps.length === 1) {
    return null;
  }

  return (
    <StepsCard title="Setup Your Engine" steps={finalSteps} delay={1000} />
  );
};

function CreateVaultAccountStep(props: {
  project: Project;
  onUserAccessTokenCreated: (userAccessToken: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-col rounded-md border bg-background p-4">
      <p className="font-medium text-primary-foreground text-sm">
        Let's get you set up with Vault.
      </p>
      <div className="h-2" />
      <p className="text-muted-foreground text-sm">
        To use Engine, you will need to manage one or more server wallets.
        Server wallets are secured and accessed through Vault, thirdweb's key
        management system.
      </p>
      <div className="h-6" />
      <div className="flex flex-row justify-end gap-4">
        <Link href="https://portal.thirdweb.com/engine/vault" target="_blank">
          <Button variant="outline">Learn more about Vault</Button>
        </Link>
        <CreateVaultAccountButton
          project={props.project}
          onUserAccessTokenCreated={props.onUserAccessTokenCreated}
        />
      </div>
    </div>
  );
}

function CreateServerWalletStep(props: {
  project: Project;
  managementAccessToken: string | undefined;
}) {
  return (
    <div className="mt-4 flex flex-col rounded-md border bg-background p-4">
      <p className="font-medium text-primary-foreground text-sm">
        Now, let's create a server wallet.
      </p>
      <div className="h-2" />
      <p className="text-muted-foreground text-sm">
        Your server wallet will be used to send transactions to the Engine.
      </p>
      <div className="h-6" />
      <div className="flex flex-row justify-end gap-4">
        <CreateServerWallet
          project={props.project}
          managementAccessToken={props.managementAccessToken}
        />
      </div>
    </div>
  );
}
