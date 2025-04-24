import type { Project } from "@/api/projects";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import RotateAdminKeyButton from "../../server-wallets/components/rotate-admin-key.client";
import CreateVaultAccountButton from "./create-vault-account.client";
import ListAccessTokensButton from "./list-access-tokens.client";

export function KeyManagement({
  maskedAdminKey,
  project,
}: { maskedAdminKey?: string; project: Project }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex flex-col px-6 pt-6">
          <h2 className="font-semibold text-xl tracking-tight">Vault</h2>
          <p className="text-muted-foreground text-sm">
            Secure, non-custodial key management system for your server wallets.{" "}
            <Link
              href="https://portal.thirdweb.com/engine/vault"
              className="underline"
            >
              Learn more.
            </Link>
          </p>
        </div>
        {!maskedAdminKey ? (
          <div className="flex flex-col gap-6">
            <div className="px-6">
              <Alert variant="info" className="bg-background">
                <AlertTitle className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  What is Vault?
                </AlertTitle>
                <AlertDescription className="text-primary-foreground text-sm">
                  Vault is thirdweb's non-custodial key management system for
                  your server wallets that allows you to:
                  <ul className="list-disc py-2 pl-4">
                    <li>Create multiple server wallets.</li>
                    <li>Create Vault access tokens.</li>
                    <li>Sign transactions using a Vault access token.</li>
                  </ul>
                  Your keys are stored in a hardware enclave, and all requests
                  are end-to-end encrypted.{" "}
                  <Link
                    href="https://portal.thirdweb.com/engine/vault"
                    className="underline"
                  >
                    Learn more about Vault security model.
                  </Link>
                  <div className="h-2" />
                  Creating server wallets and access tokens requires a Vault
                  admin account. Create one below to get started.
                </AlertDescription>
                <div className="h-4" />
              </Alert>
            </div>
            <div className="flex flex-row justify-end gap-4 border-border border-t px-6 pt-4 pb-4">
              <CreateVaultAccountButton project={project} />
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
      {maskedAdminKey ? (
        <div className="flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex flex-col px-6 pt-6">
            <h2 className="font-semibold text-xl tracking-tight">Admin Key</h2>
            <p className="text-muted-foreground text-sm">
              This key is used to create new server wallets and access tokens.
              <br /> We do not store this key. If you lose it, you can rotate it
              to create a new one. Doing so will invalidate all existing access
              tokens.
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
          <div className="flex flex-row justify-end gap-4 border-border border-t px-6 pt-4 pb-4">
            <ListAccessTokensButton project={project} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
