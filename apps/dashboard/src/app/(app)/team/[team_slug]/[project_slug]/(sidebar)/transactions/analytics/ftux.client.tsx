"use client";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/projects";
import { type Step, StepsCard } from "@/components/blocks/StepsCard";
import CreateServerWallet from "../server-wallets/components/create-server-wallet.client";
import type { Wallet } from "../server-wallets/wallet-table/types";
import { SendTestTransaction } from "./send-test-tx.client";

interface Props {
  managementAccessToken: string | undefined;
  project: Project;
  wallets: Wallet[];
  hasTransactions: boolean;
  teamSlug: string;
  testTxWithWallet?: string | undefined;
  client: ThirdwebClient;
  isManagedVault: boolean;
}

export const EngineChecklist: React.FC<Props> = (props) => {
  const finalSteps = useMemo(() => {
    const steps: Step[] = [];
    steps.push({
      children: (
        <CreateServerWalletStep
          managementAccessToken={props.managementAccessToken}
          project={props.project}
          teamSlug={props.teamSlug}
        />
      ),
      completed: props.wallets.length > 0 || props.hasTransactions,
      description:
        "Server wallets are smart wallets, they don't require any gas funds to send transactions.",
      showCompletedChildren: false,
      showIncompleteChildren: false,
      title: "Create a Server Wallet",
    });
    steps.push({
      children: (
        <SendTestTransaction
          isManagedVault={props.isManagedVault}
          client={props.client}
          project={props.project}
          teamSlug={props.teamSlug}
          wallets={props.wallets}
        />
      ),
      completed: props.hasTransactions,
      description:
        "Engine handles gas fees, and is designed for scale, speed and security. Send a test transaction to see it in action",
      showCompletedChildren: false,
      showIncompleteChildren: false,
      title: "Send a Test Transaction",
    });
    return steps;
  }, [
    props.managementAccessToken,
    props.project,
    props.wallets,
    props.hasTransactions,
    props.teamSlug,
    props.client,
    props.isManagedVault,
  ]);

  const isComplete = useMemo(
    () => finalSteps.every((step) => step.completed),
    [finalSteps],
  );

  if (props.testTxWithWallet) {
    return (
      <SendTestTransaction
        isManagedVault={props.isManagedVault}
        client={props.client}
        project={props.project}
        teamSlug={props.teamSlug}
        walletId={props.testTxWithWallet}
        wallets={props.wallets}
      />
    );
  }

  if (finalSteps.length === 0 || isComplete) {
    return null;
  }
  return (
    <StepsCard
      delay={1000}
      steps={finalSteps}
      title="Get Started with Transactions"
    />
  );
};

function CreateServerWalletStep(props: {
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
}) {
  return (
    <div className="mt-4 flex flex-row gap-4">
      <CreateServerWallet
        managementAccessToken={props.managementAccessToken}
        project={props.project}
        teamSlug={props.teamSlug}
      />
    </div>
  );
}
