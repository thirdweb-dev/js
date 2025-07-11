"use client";

import { useMutation } from "@tanstack/react-query";
import {
  CheckIcon,
  DownloadIcon,
  Loader2Icon,
  UserLockIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "@/api/projects";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import {
  createVaultAccountAndAccessToken,
  maskSecret,
} from "../../transactions/lib/vault.client";

export function CreateVaultAccountButton(props: { project: Project }) {
  const [secretKeyModalOpen, setSecretKeyModalOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [keysConfirmed, setKeysConfirmed] = useState(false);
  const [keysDownloaded, setKeysDownloaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [manageSelfChecked, setManageSelfChecked] = useState(false);
  const router = useDashboardRouter();

  const initialiseProjectWithVaultMutation = useMutation({
    mutationFn: async (projectSecretKey: string | undefined) => {
      setModalOpen(true);
      setSecretKeyModalOpen(false);

      const result = await createVaultAccountAndAccessToken({
        project: props.project,
        projectSecretKey,
      });

      return result;
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setModalOpen(false);
    },
  });

  const handleInitializeVault = async () => {
    setSecretKeyModalOpen(true);
    setErrorMessage("");
    setSecretKey("");
    setManageSelfChecked(false);
  };

  const handleSecretKeySubmit = async () => {
    if (!manageSelfChecked && !secretKey.trim()) {
      setErrorMessage(
        "Please enter your project secret key or check the option to manage keys yourself",
      );
      return;
    }

    try {
      setErrorMessage("");
      await initialiseProjectWithVaultMutation.mutateAsync(
        manageSelfChecked ? undefined : secretKey,
      );
    } catch {
      // Error will be handled by the mutation's onError
    }
  };

  const handleCancelSecretKey = () => {
    setSecretKeyModalOpen(false);
    setSecretKey("");
    setErrorMessage("");
    setManageSelfChecked(false);
  };

  const handleDownloadKeys = () => {
    if (!initialiseProjectWithVaultMutation.data) {
      return;
    }

    const fileContent = `Project:\n${props.project.name} (${props.project.publishableKey})\n\nVault Admin Key:\n${initialiseProjectWithVaultMutation.data.adminKey}\n\nVault Access Token:\n${initialiseProjectWithVaultMutation.data.walletToken.accessToken}\n`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `${props.project.name}-vault-keys.txt`;
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
    if (!keysConfirmed) {
      return;
    }

    setModalOpen(false);
    setKeysConfirmed(false);
    setKeysDownloaded(false);
    initialiseProjectWithVaultMutation.reset();
    // invalidate the page to force a reload
    router.refresh();
  };

  const isLoading = initialiseProjectWithVaultMutation.isPending;

  return (
    <div>
      <Button
        className="flex flex-row items-center gap-2"
        disabled={isLoading}
        onClick={handleInitializeVault}
        variant={"primary"}
      >
        {isLoading ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <UserLockIcon className="size-4" />
        )}
        {"Create Vault Admin Account"}
      </Button>

      {/* Secret Key Input Modal */}
      <Dialog
        modal={true}
        onOpenChange={handleCancelSecretKey}
        open={secretKeyModalOpen}
      >
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="pt-6 px-6">
            <DialogTitle>Create Your Vault</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-6 pt-0">
            <div className="space-y-3">
              <Label htmlFor="secretKey">
                Let thirdweb manage your Vault keys for you
              </Label>
              <p className="text-muted-foreground text-sm">
                Lets you use your project secret key to access your vault like
                any other thirdweb service (recommended).
              </p>
              <Input
                id="secretKey"
                type="password"
                placeholder="Enter your project secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                disabled={
                  initialiseProjectWithVaultMutation.isPending ||
                  manageSelfChecked
                }
              />
              <p className="text-muted-foreground text-xs">
                Your project secret key was generated when you created your
                project. If you lost it, you can regenerate one in your project
                settings.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <hr className="mb-4" />
              <CheckboxWithLabel className="text-foreground">
                <Checkbox
                  checked={manageSelfChecked}
                  onCheckedChange={(v) => setManageSelfChecked(!!v)}
                  disabled={initialiseProjectWithVaultMutation.isPending}
                />
                I want to manage my Vault keys myself (advanced)
              </CheckboxWithLabel>
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
            <Button
              onClick={handleCancelSecretKey}
              variant="outline"
              disabled={initialiseProjectWithVaultMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSecretKeySubmit}
              variant="primary"
              disabled={
                (!secretKey.trim() && !manageSelfChecked) ||
                initialiseProjectWithVaultMutation.isPending
              }
            >
              {initialiseProjectWithVaultMutation.isPending ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Creating vault...
                </>
              ) : (
                "Create vault"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Keys Display Modal */}
      <Dialog modal={true} onOpenChange={handleCloseModal} open={modalOpen}>
        <DialogContent
          className="overflow-hidden p-0"
          dialogCloseClassName={cn(!keysConfirmed && "hidden")}
        >
          {initialiseProjectWithVaultMutation.isPending ? (
            <>
              <DialogHeader className="p-6">
                <DialogTitle>Generating your Vault management keys</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-4 p-10">
                <Spinner className="size-8" />
                <p className="text-muted-foreground text-xs">
                  This may take a few seconds.
                </p>
              </div>
            </>
          ) : initialiseProjectWithVaultMutation.data ? (
            <div>
              <DialogHeader className="p-6">
                <DialogTitle>Save your Vault Admin Key</DialogTitle>
                <p className="text-muted-foreground text-sm">
                  You'll need this key to create server wallets and access
                  tokens.
                </p>
              </DialogHeader>

              <div className="space-y-6 p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-col gap-2">
                      <CopyTextButton
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        copyIconPosition="right"
                        textToCopy={
                          initialiseProjectWithVaultMutation.data.adminKey
                        }
                        textToShow={maskSecret(
                          initialiseProjectWithVaultMutation.data.adminKey,
                        )}
                        tooltip="Copy Admin Key"
                      />
                      <p className="text-muted-foreground text-xs">
                        Download this key to your local machine or a password
                        manager.
                      </p>
                    </div>
                  </div>
                </div>
                <Alert variant="destructive">
                  <AlertTitle>Secure your admin key</AlertTitle>
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
                      {keysDownloaded ? "Key Downloaded" : "Download Admin Key"}
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
                    I confirm that I've securely stored my admin key
                  </CheckboxWithLabel>
                </Alert>
              </div>

              <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
                <Button
                  disabled={!keysConfirmed}
                  onClick={handleCloseModal}
                  variant={"primary"}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
