"use client";

import type { Project } from "@/api/projects";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { rotateServiceAccount } from "@thirdweb-dev/vault-sdk";
import { CheckIcon, DownloadIcon, Loader2, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  createManagementAccessToken,
  createWalletAccessToken,
  initVaultClient,
  maskSecret,
} from "../../lib/vault.client";

export default function RotateAdminKeyButton(props: { project: Project }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [keysConfirmed, setKeysConfirmed] = useState(false);
  const [keysDownloaded, setKeysDownloaded] = useState(false);
  const router = useDashboardRouter();

  const rotateAdminKeyMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const vaultClient = await initVaultClient();
      const rotationCode = props.project.services.find(
        (service) => service.name === "engineCloud",
      )?.rotationCode;

      if (!rotationCode) {
        throw new Error("Rotation code not found");
      }

      const rotateServiceAccountRes = await rotateServiceAccount({
        client: vaultClient,
        request: {
          auth: {
            rotationCode,
          },
        },
      });

      if (rotateServiceAccountRes.error) {
        throw new Error(rotateServiceAccountRes.error.message);
      }

      // need to recreate the management access token with the new admin key
      const managementAccessTokenPromise = createManagementAccessToken({
        project: props.project,
        adminKey: rotateServiceAccountRes.data.newAdminKey,
        rotationCode: rotateServiceAccountRes.data.newRotationCode,
        vaultClient,
      });

      const userAccesTokenPromise = createWalletAccessToken({
        project: props.project,
        adminKey: rotateServiceAccountRes.data.newAdminKey,
        vaultClient,
      });

      const [userAccessTokenRes, managementAccessTokenRes] = await Promise.all([
        userAccesTokenPromise,
        managementAccessTokenPromise,
      ]);

      if (!managementAccessTokenRes.success || !userAccessTokenRes.success) {
        throw new Error("Failed to create access token");
      }

      return {
        success: true,
        adminKey: rotateServiceAccountRes.data.newAdminKey,
        userAccessToken: userAccessTokenRes.data,
      };
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDownloadKeys = () => {
    if (!rotateAdminKeyMutation.data) {
      return;
    }

    const fileContent = `Project: ${props.project.name} (${props.project.publishableKey})\nVault Admin Key: ${rotateAdminKeyMutation.data.adminKey}\nVault Access Token: ${rotateAdminKeyMutation.data.userAccessToken.accessToken}\n`;
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
    if (!keysConfirmed) {
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
        variant="outline"
        onClick={() => setModalOpen(true)}
        disabled={isLoading}
        className="h-auto gap-2 rounded-lg bg-background px-4 py-3"
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {!isLoading && <RefreshCcwIcon className="size-4" />}
        Rotate Admin Key
      </Button>

      <Dialog open={modalOpen} onOpenChange={handleCloseModal} modal={true}>
        <DialogContent
          className="overflow-hidden p-0"
          dialogCloseClassName={cn(!keysConfirmed && "hidden")}
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
          ) : rotateAdminKeyMutation.data ? (
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
                        textToCopy={rotateAdminKeyMutation.data.adminKey}
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        textToShow={maskSecret(
                          rotateAdminKeyMutation.data.adminKey,
                        )}
                        copyIconPosition="right"
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
                        textToCopy={
                          rotateAdminKeyMutation.data.userAccessToken
                            .accessToken
                        }
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        textToShow={maskSecret(
                          rotateAdminKeyMutation.data.userAccessToken
                            .accessToken,
                        )}
                        copyIconPosition="right"
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
                      variant="link"
                      onClick={handleDownloadKeys}
                      className="flex h-auto items-center gap-2 p-0 text-sm text-success-text"
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
                  onClick={handleCloseModal}
                  disabled={!keysConfirmed}
                  variant="primary"
                >
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
                  <p className="text-destructive">
                    This will invalidate your current admin key and all existing
                    access tokens.
                  </p>
                </div>
                <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => rotateAdminKeyMutation.mutate()}
                    disabled={rotateAdminKeyMutation.isPending}
                  >
                    {rotateAdminKeyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
