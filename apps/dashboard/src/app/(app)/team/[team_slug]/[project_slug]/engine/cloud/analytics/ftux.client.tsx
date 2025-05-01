"use client";
import type { Project } from "@/api/projects";
import { type Step, StepsCard } from "components/dashboard/StepsCard";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "../../../../../../../../@/components/ui/button";
import CreateServerWallet from "../server-wallets/components/create-server-wallet.client";
import type { Wallet } from "../server-wallets/wallet-table/types";
import CreateVaultAccountButton from "../vault/components/create-vault-account.client";
import { SendTestTransaction } from "./send-test-tx.client";

interface Props {
  managementAccessToken: string | undefined;
  project: Project;
  wallets: Wallet[];
  hasTransactions: boolean;
  teamSlug: string;
}

export const EngineChecklist: React.FC<Props> = (props) => {
  const [userAccessToken, setUserAccessToken] = useState<string | undefined>();

  const finalSteps = useMemo(() => {
    const steps: Step[] = [];
    steps.push({
      title: "Create a Vault Admin Account",
      description:
        "Vault is thirdweb's key management system. It allows you to create secure server wallets and manage access tokens.",
      children: (
        <CreateVaultAccountStep
          project={props.project}
          teamSlug={props.teamSlug}
          onUserAccessTokenCreated={(token) => setUserAccessToken(token)}
        />
      ),
      completed: !!props.managementAccessToken,
      showCompletedChildren: false,
    });
    steps.push({
      title: "Create a Server Wallet",
      description:
        "Server wallets are smart wallets, they don't require any gas funds to send transactions.",
      children: (
        <CreateServerWalletStep
          project={props.project}
          teamSlug={props.teamSlug}
          managementAccessToken={props.managementAccessToken}
        />
      ),
      completed: props.wallets.length > 0,
      showIncompleteChildren: false,
      showCompletedChildren: false,
    });
    steps.push({
      title: "Send a Test Transaction",
      description:
        "Engine handles gas fees, and is designed for scale, speed and security. Send a test transaction to see it in action",
      children: (
        <SendTestTransaction
          wallets={props.wallets}
          project={props.project}
          userAccessToken={userAccessToken}
        />
      ),
      completed: props.hasTransactions,
      showIncompleteChildren: false,
      showCompletedChildren: false,
    });
    return steps;
  }, [
    props.managementAccessToken,
    props.project,
    props.wallets,
    props.hasTransactions,
    userAccessToken,
    props.teamSlug,
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
  teamSlug: string;
  onUserAccessTokenCreated: (userAccessToken: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-row gap-4">
      <CreateVaultAccountButton
        project={props.project}
        onUserAccessTokenCreated={props.onUserAccessTokenCreated}
      />
      <Link href="https://portal.thirdweb.com/engine/vault" target="_blank">
        <Button variant="outline">Learn more about Vault</Button>
      </Link>
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
        project={props.project}
        teamSlug={props.teamSlug}
        managementAccessToken={props.managementAccessToken}
      />
    </div>
  );
}
