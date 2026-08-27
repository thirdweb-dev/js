"use client";

import { useMutation } from "@tanstack/react-query";
import {
  CheckIcon,
  CircleAlertIcon,
  DownloadIcon,
  Loader2Icon,
  LogOutIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { rotateVaultServiceAccount } from "@/actions/vault";
import type { Project } from "@/api/project/projects";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { maskSecret } from "../../transactions/lib/vault.client";

export default function RotateAdminKeyButton(props: {
  project: Project;
  isManagedVault: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [keysConfirmed, setKeysConfirmed] = useState(false);
  const [keysDownloaded, setKeysDownloaded] = useState(false);
  const [stayManaged, setStayManaged] = useState(props.isManagedVault);
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const router = useDashboardRouter();

  const willStayManaged = stayManaged && secretKeyInput.trim().length > 0;
  const missingSecretKey = stayManaged && secretKeyInput.trim().length === 0;

  const rotateAdminKeyMutation = useMutation({
    mutationFn: async () => {
      return rotateVaultServiceAccount({
        project: {
          projectId: props.project.id,
          teamId: props.project.teamId,
        },
        projectSecretKey: willStayManaged ? secretKeyInput.trim() : undefined,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Only an ejected vault returns the new keys; a managed vault keeps them.
  const rotatedKeys =
    rotateAdminKeyMutation.data?.adminKey &&
    rotateAdminKeyMutation.data.walletAccessToken
      ? {
          adminKey: rotateAdminKeyMutation.data.adminKey,
          walletAccessToken: rotateAdminKeyMutation.data.walletAccessToken,
        }
      : undefined;

  const handleDownloadKeys = () => {
    if (!rotatedKeys) {
      return;
    }

    const fileContent = `Project:\n${props.project.name} (${props.project.publishableKey})\n\nVault Admin Key:\n${rotatedKeys.adminKey}\n\nVault Access Token:\n${rotatedKeys.walletAccessToken}\n`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `${props.project.name}-vault-keys-rotated.txt`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link); // Required for Firefox
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Keys downloaded as ${filename}`);
    setKeysDownloaded(true);
  };

  const handleCloseModal = () => {
    if (rotatedKeys && !keysConfirmed) {
      return;
    }

    setModalOpen(false);
    setKeysConfirmed(false);
    setKeysDownloaded(false);
    // invalidate the page to force a reload
    rotateAdminKeyMutation.reset();
    router.refresh();
  };

  const isLoading = rotateAdminKeyMutation.isPending;

  return (
    <>
      <Button
        className="h-auto gap-2 rounded-lg bg-background px-4 py-3"
        disabled={isLoading}
        onClick={() => setModalOpen(true)}
        variant="outline"
      >
        {isLoading && <Loader2Icon className="size-4 animate-spin" />}
        {!isLoading && !props.isManagedVault ? (
          <RefreshCcwIcon className="size-4" />
        ) : (
          <LogOutIcon className="size-4" />
        )}
        Rotate Admin Key
      </Button>

      <Dialog modal={true} onOpenChange={handleCloseModal} open={modalOpen}>
        <DialogContent
          className="overflow-hidden p-0"
          dialogCloseClassName={cn(rotatedKeys && !keysConfirmed && "hidden")}
        >
          {rotateAdminKeyMutation.isPending ? (
            <>
              <DialogHeader className="p-6">
                <DialogTitle>Generating new keys...</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-4 p-10">
                <Spinner className="size-8" />
                <p className="text-muted-foreground text-xs">
                  This may take a few seconds.
                </p>
              </div>
            </>
          ) : rotatedKeys ? (
            <div>
              <DialogHeader className="p-6">
                <DialogTitle>New Vault Keys</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium text-sm">
                      New Vault Admin Key
                    </h3>
                    <div className="flex flex-col gap-2">
                      <CopyTextButton
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        copyIconPosition="right"
                        textToCopy={rotatedKeys.adminKey}
                        textToShow={maskSecret(rotatedKeys.adminKey)}
                        tooltip="Copy Admin Key"
                      />
                      <p className="text-muted-foreground text-xs">
                        This key is used to create or revoke your access tokens.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-sm">
                      New Vault Access Token
                    </h3>
                    <div className="flex flex-col gap-2 ">
                      <CopyTextButton
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        copyIconPosition="right"
                        textToCopy={rotatedKeys.walletAccessToken}
                        textToShow={maskSecret(rotatedKeys.walletAccessToken)}
                        tooltip="Copy Vault Access Token"
                      />
                      <p className="text-muted-foreground text-xs">
                        This access token is used to sign transactions and
                        messages from your backend. Can be revoked and recreated
                        with your admin key.
                      </p>
                    </div>
                  </div>
                </div>
                <Alert variant="destructive">
                  <AlertTitle>Secure your keys</AlertTitle>
                  <AlertDescription>
                    These keys will not be displayed again. Store them securely
                    as they provide access to your server wallets.
                  </AlertDescription>
                  <div className="h-4" />
                  <div className="flex items-center gap-2">
                    <Button
                      className="flex h-auto items-center gap-2 p-0 text-sm text-success-text"
                      onClick={handleDownloadKeys}
                      variant="link"
                    >
                      <DownloadIcon className="size-4" />
                      {keysDownloaded ? "Keys Downloaded" : "Download Keys"}
                    </Button>
                    {keysDownloaded && (
                      <span className="text-success-text text-xs">
                        <CheckIcon className="size-4" />
                      </span>
                    )}
                  </div>
                  <div className="h-4" />
                  <CheckboxWithLabel className="text-foreground">
                    <Checkbox
                      checked={keysConfirmed}
                      onCheckedChange={(v) => setKeysConfirmed(!!v)}
                    />
                    I confirm that I've securely stored these keys
                  </CheckboxWithLabel>
                </Alert>
              </div>

              <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
                <Button
                  disabled={!keysConfirmed}
                  onClick={handleCloseModal}
                  variant="primary"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : rotateAdminKeyMutation.data ? (
            <div>
              <DialogHeader className="p-6">
                <DialogTitle>Admin Key Rotated</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 p-6 pt-0">
                <div>
                  <h3 className="mb-2 font-medium text-sm">
                    New Vault Admin Key
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full items-center rounded-lg border bg-background px-3 py-3 font-mono text-xs">
                      {rotateAdminKeyMutation.data.maskedAdminKey}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Your admin key and wallet access token were re-encrypted
                      with your project secret key. Your backend keeps working
                      without changes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
                <Button onClick={handleCloseModal} variant="primary">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>Rotate your Vault admin key</DialogTitle>
                <DialogDescription>
                  This action will generate a new Vault admin key and rotation
                  code.{" "}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 px-6">
                  <p className="text-md text-primary-foreground">
                    Revoke your current keys and generates new ones.
                  </p>

                  {props.isManagedVault && (
                    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          checked={stayManaged}
                          id="stay-managed"
                          onCheckedChange={(checked) => {
                            setStayManaged(checked === true);
                            if (checked !== true) {
                              setSecretKeyInput("");
                            }
                          }}
                        />
                        <label
                          className="cursor-pointer text-sm leading-tight"
                          htmlFor="stay-managed"
                        >
                          Keep this vault managed by thirdweb (recommended)
                        </label>
                      </div>

                      {stayManaged ? (
                        <>
                          <label
                            className="font-medium text-sm"
                            htmlFor="rotate-secret-key"
                          >
                            Project Secret Key
                          </label>
                          <Input
                            id="rotate-secret-key"
                            onChange={(e) => setSecretKeyInput(e.target.value)}
                            placeholder="Your project secret key"
                            type="password"
                            value={secretKeyInput}
                          />
                          <p className="text-muted-foreground text-xs">
                            Used to re-encrypt your new admin key and wallet
                            access token so your existing backend keeps working
                            without changes. It is never stored.
                          </p>
                          {missingSecretKey && (
                            <p className="text-destructive-text text-xs">
                              Enter your project secret key to keep this vault
                              managed, or uncheck the box above to eject.
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-muted-foreground text-xs">
                          Your vault will be ejected. You will receive the new
                          admin key to store yourself, and your backend must be
                          updated to pass a wallet access token directly.
                        </p>
                      )}
                    </div>
                  )}

                  <Alert variant="destructive">
                    <CircleAlertIcon className="size-5" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      {willStayManaged
                        ? "This will invalidate your current admin key and all existing access tokens. Your stored credentials will be re-encrypted automatically, so your server wallets keep working."
                        : "This action will invalidate your current admin key and all existing access tokens. You will need to update your backend to use these new access tokens."}
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
                  <Button
                    onClick={() => {
                      setModalOpen(false);
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      rotateAdminKeyMutation.isPending || missingSecretKey
                    }
                    onClick={() => rotateAdminKeyMutation.mutate()}
                    variant="destructive"
                  >
                    {rotateAdminKeyMutation.isPending ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Rotating...
                      </>
                    ) : (
                      "Rotate Admin Key"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
