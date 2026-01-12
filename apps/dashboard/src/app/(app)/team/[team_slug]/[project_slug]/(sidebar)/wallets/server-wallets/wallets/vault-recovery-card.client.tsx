"use client";

import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangleIcon,
  CheckIcon,
  DownloadIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "@/api/project/projects";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import {
  createVaultAccountAndAccessToken,
  initVaultClient,
  maskSecret,
} from "../../../transactions/lib/vault.client";

interface VaultRecoveryCardProps {
  errorMessage: string;
  project: Project;
}

export function VaultRecoveryCard({
  errorMessage,
  project,
}: VaultRecoveryCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [secretKeyInput, setSecretKeyInput] = useState("");
  // Option for managed vault users who lost their secret key
  const [manageKeysSelf, setManageKeysSelf] = useState(false);
  // For ejected vault key download flow
  const [keysConfirmed, setKeysConfirmed] = useState(false);
  const [keysDownloaded, setKeysDownloaded] = useState(false);

  // Check if this was a managed vault (had encryptedAdminKey)
  const engineCloudService = project.services.find(
    (s) => s.name === "engineCloud",
  );
  const wasManagedVault = !!engineCloudService?.encryptedAdminKey;

  // Will create ejected vault if: wasn't managed, OR user chose to manage keys themselves
  const willCreateEjectedVault = !wasManagedVault || manageKeysSelf;

  const isInsufficientScopeError =
    errorMessage.includes("AUTH_INSUFFICIENT_SCOPE") ||
    errorMessage.toLowerCase().includes("insufficient scope");

  const regenerateMutation = useMutation({
    mutationFn: async () => {
      await initVaultClient();

      const result = await createVaultAccountAndAccessToken({
        project,
        // Only pass secret key if creating managed vault (not ejected)
        projectSecretKey: willCreateEjectedVault ? undefined : secretKeyInput,
      });

      return result;
    },
    onSuccess: () => {
      // For managed vaults (with secret key), reload immediately
      // For ejected vaults, show the key download dialog first
      if (!willCreateEjectedVault) {
        window.location.reload();
      }
      // For ejected vaults, we stay in the dialog to show the admin key
    },
  });

  const handleDownloadKeys = () => {
    if (!regenerateMutation.data) {
      return;
    }

    const fileContent = `Project:\n${project.name} (${project.publishableKey})\n\nVault Admin Key:\n${regenerateMutation.data.adminKey}\n\nVault Access Token:\n${regenerateMutation.data.walletToken.accessToken}\n`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `${project.name}-vault-keys.txt`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Keys downloaded as ${filename}`);
    setKeysDownloaded(true);
  };

  const handleCloseAfterKeysSaved = () => {
    if (!keysConfirmed) {
      return;
    }
    window.location.reload();
  };

  // For managed vaults creating managed vault, require secret key input
  // For ejected vaults (or managed choosing to manage keys), just need confirmation
  const canProceed = willCreateEjectedVault
    ? confirmed
    : confirmed && secretKeyInput.trim().length > 0;

  if (!isInsufficientScopeError) {
    // Show standard error for non-scope errors
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
        <p className="mb-2 font-semibold text-destructive">EVM Wallet Error</p>
        <p className="text-muted-foreground text-sm">{errorMessage}</p>
      </div>
    );
  }

  return (
    <Alert variant="destructive" className="border-destructive/50">
      <AlertTriangleIcon className="size-4" />
      <AlertTitle>Server Wallet Access Lost</AlertTitle>
      <AlertDescription className="mt-3 space-y-4">
        <p>
          Your server wallet credentials have become invalid. This can happen if
          the secret key was rotated but the new credentials weren&apos;t saved
          properly.
        </p>

        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="font-medium text-destructive-text text-sm">
            ⚠️ Important: Existing wallets cannot be recovered
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            If you have existing wallets that are important to your project,
            please{" "}
            <a
              href="https://thirdweb.com/support"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link-foreground underline"
            >
              contact support
            </a>{" "}
            before proceeding.
          </p>
        </div>

        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <RotateCcwIcon className="size-4" />
              Create New Server Wallet
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            {/* Show key download UI for ejected vaults after success */}
            {willCreateEjectedVault && regenerateMutation.data ? (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save your Vault Admin Key</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-4">
                      <p>
                        You&apos;ll need this key to create server wallets and
                        access tokens.
                      </p>

                      <div className="space-y-2">
                        <CopyTextButton
                          className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                          copyIconPosition="right"
                          textToCopy={regenerateMutation.data.adminKey}
                          textToShow={maskSecret(
                            regenerateMutation.data.adminKey,
                          )}
                          tooltip="Copy Admin Key"
                        />
                        <p className="text-muted-foreground text-xs">
                          Download this key to your local machine or a password
                          manager.
                        </p>
                      </div>

                      <Alert variant="destructive">
                        <AlertTitle>Secure your admin key</AlertTitle>
                        <AlertDescription>
                          This key will not be displayed again. Store it
                          securely as it provides access to your server wallets.
                        </AlertDescription>
                        <div className="mt-4 flex items-center gap-2">
                          <Button
                            className="flex h-auto items-center gap-2 p-0 text-sm text-success-text"
                            onClick={handleDownloadKeys}
                            variant="link"
                          >
                            <DownloadIcon className="size-4" />
                            {keysDownloaded
                              ? "Key Downloaded"
                              : "Download Admin Key"}
                          </Button>
                          {keysDownloaded && (
                            <span className="text-success-text text-xs">
                              <CheckIcon className="size-4" />
                            </span>
                          )}
                        </div>
                        <div className="mt-4">
                          <CheckboxWithLabel className="text-foreground">
                            <Checkbox
                              checked={keysConfirmed}
                              onCheckedChange={(v) => setKeysConfirmed(!!v)}
                            />
                            I confirm that I&apos;ve securely stored my admin
                            key
                          </CheckboxWithLabel>
                        </div>
                      </Alert>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    disabled={!keysConfirmed}
                    onClick={handleCloseAfterKeysSaved}
                    variant="primary"
                  >
                    Close
                  </AlertDialogAction>
                </AlertDialogFooter>
              </>
            ) : (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Create New Server Wallet Configuration?
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-3">
                      <p>
                        This will create a completely new server wallet
                        configuration for your project.
                      </p>
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                        <p className="font-semibold text-destructive-text text-sm">
                          Warning: This action cannot be undone
                        </p>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground text-sm">
                          <li>
                            Any existing server wallets will be permanently
                            inaccessible
                          </li>
                          <li>
                            You will need to create new wallets after this
                            process
                          </li>
                        </ul>
                      </div>

                      {wasManagedVault && (
                        <div className="space-y-3">
                          {!manageKeysSelf && (
                            <>
                              <label
                                htmlFor="secret-key-input"
                                className="font-medium text-sm"
                              >
                                Enter your project Secret Key
                              </label>
                              <Input
                                id="secret-key-input"
                                type="password"
                                placeholder="sk_..."
                                value={secretKeyInput}
                                onChange={(e) =>
                                  setSecretKeyInput(e.target.value)
                                }
                              />
                              <p className="text-muted-foreground text-xs">
                                Your secret key is required to create a managed
                                vault.
                              </p>
                            </>
                          )}

                          <div className="flex items-start gap-2 border-t pt-3">
                            <Checkbox
                              id="manage-keys-self"
                              checked={manageKeysSelf}
                              onCheckedChange={(checked) => {
                                setManageKeysSelf(checked === true);
                                if (checked) {
                                  setSecretKeyInput("");
                                }
                              }}
                            />
                            <label
                              htmlFor="manage-keys-self"
                              className="cursor-pointer text-sm leading-tight"
                            >
                              I lost my secret key and want to manage vault keys
                              myself (advanced)
                            </label>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-2 pt-2">
                        <Checkbox
                          id="confirm-recovery"
                          checked={confirmed}
                          onCheckedChange={(checked) =>
                            setConfirmed(checked === true)
                          }
                        />
                        <label
                          htmlFor="confirm-recovery"
                          className="cursor-pointer text-sm leading-tight"
                        >
                          I understand that existing server wallets will not be
                          recoverable and I want to proceed
                        </label>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setConfirmed(false);
                      setSecretKeyInput("");
                      setManageKeysSelf(false);
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={!canProceed || regenerateMutation.isPending}
                    onClick={(e) => {
                      e.preventDefault();
                      regenerateMutation.mutate();
                    }}
                    variant="destructive"
                    className="gap-2"
                  >
                    {regenerateMutation.isPending && (
                      <Spinner className="size-4" />
                    )}
                    Create New Wallet Configuration
                  </AlertDialogAction>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>

        {regenerateMutation.error && (
          <p className="text-destructive-text text-sm">
            Failed to create new configuration:{" "}
            {regenerateMutation.error.message}
          </p>
        )}

        <p className="text-muted-foreground text-xs">
          Error details: {errorMessage}
        </p>
      </AlertDescription>
    </Alert>
  );
}
