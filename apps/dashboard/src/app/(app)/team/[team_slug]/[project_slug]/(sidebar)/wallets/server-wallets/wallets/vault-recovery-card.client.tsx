"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import {
  createVaultAccountAndAccessToken,
  initVaultClient,
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

  // Check if this was a managed vault (had encryptedAdminKey)
  const engineCloudService = project.services.find(
    (s) => s.name === "engineCloud",
  );
  const wasManagedVault = !!engineCloudService?.encryptedAdminKey;

  const isInsufficientScopeError =
    errorMessage.includes("AUTH_INSUFFICIENT_SCOPE") ||
    errorMessage.toLowerCase().includes("insufficient scope");

  const regenerateMutation = useMutation({
    mutationFn: async () => {
      await initVaultClient();

      const result = await createVaultAccountAndAccessToken({
        project,
        // Only pass secret key if it was a managed vault and user provided one
        projectSecretKey: wasManagedVault ? secretKeyInput : undefined,
      });

      return result;
    },
    onSuccess: () => {
      // Refresh the page to show the new wallet state
      window.location.reload();
    },
  });

  // For managed vaults, require secret key input
  const canProceed = wasManagedVault
    ? confirmed && secretKeyInput.trim().length > 0
    : confirmed;

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
                        You will need to create new wallets after this process
                      </li>
                    </ul>
                  </div>

                  {wasManagedVault && (
                    <div className="space-y-2">
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
                        onChange={(e) => setSecretKeyInput(e.target.value)}
                      />
                      <p className="text-muted-foreground text-xs">
                        Your secret key is required to create a managed vault.
                      </p>
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
                {regenerateMutation.isPending && <Spinner className="size-4" />}
                Create New Wallet Configuration
              </AlertDialogAction>
            </AlertDialogFooter>
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
