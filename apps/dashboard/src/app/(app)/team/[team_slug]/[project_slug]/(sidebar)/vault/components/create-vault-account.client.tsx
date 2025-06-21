"use client";

import { useMutation } from "@tanstack/react-query";
import { createServiceAccount } from "@thirdweb-dev/vault-sdk";
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
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { storeUserAccessToken } from "../../transactions/analytics/utils";
import {
  createManagementAccessToken,
  createWalletAccessToken,
  initVaultClient,
  maskSecret,
} from "../../transactions/lib/vault.client";

export function CreateVaultAccountButton(props: {
  project: Project;
  onUserAccessTokenCreated?: (userAccessToken: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [keysConfirmed, setKeysConfirmed] = useState(false);
  const [keysDownloaded, setKeysDownloaded] = useState(false);
  const router = useDashboardRouter();

  const initialiseProjectWithVaultMutation = useMutation({
    mutationFn: async () => {
      setModalOpen(true);

      const vaultClient = await initVaultClient();

      const serviceAccount = await createServiceAccount({
        client: vaultClient,
        request: {
          options: {
            metadata: {
              projectId: props.project.id,
              purpose: "Thirdweb Project Server Wallet Service Account",
              teamId: props.project.teamId,
            },
          },
        },
      });

      if (!serviceAccount.success) {
        throw new Error("Failed to create service account");
      }

      const managementAccessTokenPromise = createManagementAccessToken({
        adminKey: serviceAccount.data.adminKey,
        project: props.project,
        rotationCode: serviceAccount.data.rotationCode,
        vaultClient,
      });

      const userAccesTokenPromise = createWalletAccessToken({
        adminKey: serviceAccount.data.adminKey,
        project: props.project,
        vaultClient,
      });

      const [userAccessTokenRes, managementAccessTokenRes] = await Promise.all([
        userAccesTokenPromise,
        managementAccessTokenPromise,
      ]);

      if (!managementAccessTokenRes.success || !userAccessTokenRes.success) {
        throw new Error("Failed to create access token");
      }

      // save in local storage in case the user refreshes the page during FTUX
      storeUserAccessToken(
        props.project.id,
        userAccessTokenRes.data.accessToken,
      );
      props.onUserAccessTokenCreated?.(userAccessTokenRes.data.accessToken);

      return {
        serviceAccount: serviceAccount.data,
        userAccessToken: userAccessTokenRes.data,
      };
    },
    onError: (error) => {
      toast.error(error.message);
      setModalOpen(false);
    },
  });

  const handleCreateServerWallet = async () => {
    await initialiseProjectWithVaultMutation.mutateAsync();
  };

  const handleDownloadKeys = () => {
    if (!initialiseProjectWithVaultMutation.data) {
      return;
    }

    const fileContent = `Project:\n${props.project.name} (${props.project.publishableKey})\n\nVault Admin Key:\n${initialiseProjectWithVaultMutation.data.serviceAccount.adminKey}\n\nVault Access Token:\n${initialiseProjectWithVaultMutation.data.userAccessToken.accessToken}\n`;
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
    <>
      <Button
        className="flex flex-row items-center gap-2"
        disabled={isLoading}
        onClick={handleCreateServerWallet}
        variant={"primary"}
      >
        {isLoading ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <UserLockIcon className="size-4" />
        )}
        {"Create Vault Admin Account"}
      </Button>

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
                          initialiseProjectWithVaultMutation.data.serviceAccount
                            .adminKey
                        }
                        textToShow={maskSecret(
                          initialiseProjectWithVaultMutation.data.serviceAccount
                            .adminKey,
                        )}
                        tooltip="Copy Admin Key"
                      />
                      <p className="text-muted-foreground text-xs">
                        Download this key to your local machine or a password
                        manager.
                      </p>
                    </div>
                  </div>

                  {/* <div>
                    <h3 className="mb-2 font-medium text-sm">
                      Vault Access Token
                    </h3>
                    <div className="flex flex-col gap-2 ">
                      <CopyTextButton
                        textToCopy={
                          initialiseProjectWithVaultMutation.data
                            .userAccessToken.accessToken
                        }
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        textToShow={maskSecret(
                          initialiseProjectWithVaultMutation.data
                            .userAccessToken.accessToken,
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
                  </div> */}
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
    </>
  );
}
