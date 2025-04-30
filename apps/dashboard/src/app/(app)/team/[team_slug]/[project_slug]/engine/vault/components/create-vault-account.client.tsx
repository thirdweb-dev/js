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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createServiceAccount } from "@thirdweb-dev/vault-sdk";
import { CheckIcon, DownloadIcon, Loader2, LockIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  createManagementAccessToken,
  createWalletAccessToken,
  initVaultClient,
  maskSecret,
} from "../../lib/vault.client";

export default function CreateVaultAccountButton(props: {
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
              teamId: props.project.teamId,
              purpose: "Thirdweb Project Server Wallet Service Account",
            },
          },
        },
      });

      if (!serviceAccount.success) {
        throw new Error("Failed to create service account");
      }

      const managementAccessTokenPromise = createManagementAccessToken({
        project: props.project,
        adminKey: serviceAccount.data.adminKey,
        rotationCode: serviceAccount.data.rotationCode,
        vaultClient,
      });

      const userAccesTokenPromise = createWalletAccessToken({
        project: props.project,
        adminKey: serviceAccount.data.adminKey,
        vaultClient,
      });

      const [userAccessTokenRes, managementAccessTokenRes] = await Promise.all([
        userAccesTokenPromise,
        managementAccessTokenPromise,
      ]);

      if (!managementAccessTokenRes.success || !userAccessTokenRes.success) {
        throw new Error("Failed to create access token");
      }

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

    const fileContent = `Project: ${props.project.name} (${props.project.publishableKey})\nVault Admin Key: ${initialiseProjectWithVaultMutation.data.serviceAccount.adminKey}\nVault Access Token: ${initialiseProjectWithVaultMutation.data.userAccessToken.accessToken}\n`;
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
        variant={"primary"}
        onClick={handleCreateServerWallet}
        disabled={isLoading}
        className="flex flex-row items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <LockIcon className="size-4" />
        )}
        {"Create Vault Admin Account"}
      </Button>

      <Dialog open={modalOpen} onOpenChange={handleCloseModal} modal={true}>
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
                <DialogTitle>Vault Management Keys</DialogTitle>
                <p className="text-muted-foreground text-sm">
                  These keys are used for end-to-end encryption and are required
                  to interact with Vault, thirdweb's key management system.
                </p>
              </DialogHeader>

              <div className="space-y-6 p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium text-sm">
                      Vault Admin Key
                    </h3>
                    <div className="flex flex-col gap-2">
                      <CopyTextButton
                        textToCopy={
                          initialiseProjectWithVaultMutation.data.serviceAccount
                            .adminKey
                        }
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        textToShow={maskSecret(
                          initialiseProjectWithVaultMutation.data.serviceAccount
                            .adminKey,
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
