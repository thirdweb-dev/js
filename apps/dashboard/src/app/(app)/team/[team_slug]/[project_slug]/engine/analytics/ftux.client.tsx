"use client";
import type { Project } from "@/api/projects";
import { type Step, StepsCard } from "components/dashboard/StepsCard";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "../../../../../../../@/components/ui/button";
import CreateServerWallet from "../server-wallets/components/create-server-wallet.client";
import type { Wallet } from "../server-wallets/wallet-table/types";
import CreateVaultAccountButton from "../vault/components/create-vault-account.client";
import { SendTestTransaction } from "./send-test-tx.client";

interface Props {
  managementAccessToken: string | undefined;
  project: Project;
  wallets: Wallet[];
  hasTransactions: boolean;
}

export const EngineChecklist: React.FC<Props> = (props) => {
  const finalSteps = useMemo(() => {
    const steps: Step[] = [];
    steps.push({
      title: "Create a Vault Admin Account",
      description:
        "Your Vault admin account will be used to create server wallets and manage access tokens.",
      children: <CreateVaultAccountStep project={props.project} />,
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
        <SendTestTransaction wallets={props.wallets} project={props.project} />
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
  ]);

  if (finalSteps.length === 1) {
    return null;
  }

  return (
    <StepsCard title="Setup Your Engine" steps={finalSteps} delay={1000} />
  );
};

function CreateVaultAccountStep(props: { project: Project }) {
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
        <Link href="https://portal.thirdweb.com/engine/vault">
          <Button variant="outline">Learn more about Vault</Button>
        </Link>
        <CreateVaultAccountButton project={props.project} />
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
