import { InfoIcon } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/api/projects";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreateVaultAccountButton } from "./create-vault-account.client";
import ListAccessTokens from "./list-access-tokens.client";
import RotateAdminKeyButton from "./rotate-admin-key.client";

export function KeyManagement({
  maskedAdminKey,
  project,
}: {
  maskedAdminKey?: string;
  project: Project;
}) {
  return (
    <div className="flex flex-col gap-6">
      {!maskedAdminKey && <CreateVaultAccountAlert project={project} />}

      {maskedAdminKey && (
        <>
          <div className="flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex flex-col p-6">
              <h2 className="font-semibold text-xl tracking-tight">
                Admin Key
              </h2>
              <p className="text-muted-foreground text-sm">
                This key is used to create new server wallets and access tokens.
                <br /> We do not store this key. If you lose it, you can rotate
                it to create a new one. Doing so will invalidate all existing
                access tokens.
              </p>
              <div className="h-4" />
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex min-w-[300px] flex-row items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm">
                  <p className="text-muted-foreground text-sm">
                    {maskedAdminKey}
                  </p>
                </div>
                <RotateAdminKeyButton project={project} />
              </div>
            </div>
          </div>
          <ListAccessTokens project={project} />
        </>
      )}
    </div>
  );
}

async function CreateVaultAccountAlert(props: { project: Project }) {
  return (
    <div className="flex flex-col gap-6">
      <Alert className="bg-background" variant="info">
        <AlertTitle className="flex items-center gap-2">
          <InfoIcon className="h-4 w-4" />
          What is Vault?
        </AlertTitle>
        <AlertDescription className="text-primary-foreground text-sm">
          Vault is thirdweb's non-custodial key management system for your
          server wallets that allows you to:
          <ul className="list-disc py-2 pl-4">
            <li>Create multiple server wallets.</li>
            <li>Create Vault access tokens.</li>
            <li>Sign transactions using a Vault access token.</li>
          </ul>
          Your keys are stored in a hardware enclave, and all requests are
          end-to-end encrypted.{" "}
          <Link
            className="underline"
            href="https://portal.thirdweb.com/vault"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more about Vault security model.
          </Link>
          <div className="h-2" />
          Creating server wallets and access tokens requires a Vault admin
          account. Create one below to get started.
        </AlertDescription>
        <div className="h-4" />
      </Alert>

      <CreateVaultAccountButton project={props.project} />
    </div>
  );
}
