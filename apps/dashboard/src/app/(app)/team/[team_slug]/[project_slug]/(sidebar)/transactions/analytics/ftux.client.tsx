"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/projects";
import { type Step, StepsCard } from "@/components/blocks/StepsCard";
import { Button } from "@/components/ui/button";
import { CreateVaultAccountButton } from "../../vault/components/create-vault-account.client";
import CreateServerWallet from "../server-wallets/components/create-server-wallet.client";
import type { Wallet } from "../server-wallets/wallet-table/types";
import { SendTestTransaction } from "./send-test-tx.client";
import { deleteUserAccessToken } from "./utils";

interface Props {
  managementAccessToken: string | undefined;
  project: Project;
  wallets: Wallet[];
  hasTransactions: boolean;
  teamSlug: string;
  testTxWithWallet?: string | undefined;
  client: ThirdwebClient;
}

export const EngineChecklist: React.FC<Props> = (props) => {
  const [userAccessToken, setUserAccessToken] = useState<string | undefined>();

  const finalSteps = useMemo(() => {
    const steps: Step[] = [];
    steps.push({
      children: (
        <CreateVaultAccountStep
          onUserAccessTokenCreated={(token) => setUserAccessToken(token)}
          project={props.project}
          teamSlug={props.teamSlug}
        />
      ),
      completed: !!props.managementAccessToken,
      description:
        "Vault is thirdweb's key management system. It allows you to create secure server wallets and manage access tokens.",
      showCompletedChildren: false,
      title: "Create a Vault Admin Account",
    });
    steps.push({
      children: (
        <CreateServerWalletStep
          managementAccessToken={props.managementAccessToken}
          project={props.project}
          teamSlug={props.teamSlug}
        />
      ),
      completed: props.wallets.length > 0,
      description:
        "Server wallets are smart wallets, they don't require any gas funds to send transactions.",
      showCompletedChildren: false,
      showIncompleteChildren: false,
      title: "Create a Server Wallet",
    });
    steps.push({
      children: (
        <SendTestTransaction
          client={props.client}
          project={props.project}
          teamSlug={props.teamSlug}
          userAccessToken={userAccessToken}
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
    userAccessToken,
    props.teamSlug,
    props.client,
  ]);

  const isComplete = useMemo(
    () => finalSteps.every((step) => step.completed),
    [finalSteps],
  );

  if (props.testTxWithWallet) {
    return (
      <SendTestTransaction
        client={props.client}
        project={props.project}
        teamSlug={props.teamSlug}
        userAccessToken={userAccessToken}
        walletId={props.testTxWithWallet}
        wallets={props.wallets}
      />
    );
  }

  if (finalSteps.length === 0 || isComplete) {
    // clear token from local storage after FTUX is complete
    deleteUserAccessToken(props.project.id);
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

function CreateVaultAccountStep(props: {
  project: Project;
  teamSlug: string;
  onUserAccessTokenCreated: (userAccessToken: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-row gap-4">
      <CreateVaultAccountButton
        onUserAccessTokenCreated={props.onUserAccessTokenCreated}
        project={props.project}
      />
      <Button asChild variant="outline">
        <Link
          href="https://portal.thirdweb.com/vault"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more about Vault
        </Link>
      </Button>
    </div>
  );
}

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
