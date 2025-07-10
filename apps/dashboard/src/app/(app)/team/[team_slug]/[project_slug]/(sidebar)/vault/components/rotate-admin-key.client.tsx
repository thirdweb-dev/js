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
import type { Project } from "@/api/projects";
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
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import {
  createVaultAccountAndAccessToken,
  maskSecret,
} from "../../transactions/lib/vault.client";

export default function RotateAdminKeyButton(props: {
  project: Project;
  isManagedVault: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [keysConfirmed, setKeysConfirmed] = useState(false);
  const [keysDownloaded, setKeysDownloaded] = useState(false);
  const router = useDashboardRouter();

  const rotateAdminKeyMutation = useMutation({
    mutationFn: async () => {
      // passing no secret key means we're rotating the admin key and deleting any stored keys
      const result = await createVaultAccountAndAccessToken({
        project: props.project,
      });

      return {
        adminKey: result.adminKey,
        success: true,
        userAccessToken: result.walletToken,
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

    const fileContent = `Project:\n${props.project.name} (${props.project.publishableKey})\n\nVault Admin Key:\n${rotateAdminKeyMutation.data.adminKey}\n\nVault Access Token:\n${rotateAdminKeyMutation.data.userAccessToken.accessToken}\n`;
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
        className="h-auto gap-2 rounded-lg bg-background px-4 py-3"
        disabled={isLoading}
        onClick={() => setModalOpen(true)}
        variant="outline"
      >
        {isLoading && <Loader2Icon className="size-4 animate-spin" />}
        {!isLoading && props.isManagedVault ? (
          <LogOutIcon className="size-4" />
        ) : (
          <RefreshCcwIcon className="size-4" />
        )}
        {props.isManagedVault ? "Eject From Managed Vault" : "Rotate Admin Key"}
      </Button>

      <Dialog modal={true} onOpenChange={handleCloseModal} open={modalOpen}>
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
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        copyIconPosition="right"
                        textToCopy={rotateAdminKeyMutation.data.adminKey}
                        textToShow={maskSecret(
                          rotateAdminKeyMutation.data.adminKey,
                        )}
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
                        textToCopy={
                          rotateAdminKeyMutation.data.userAccessToken
                            .accessToken
                        }
                        textToShow={maskSecret(
                          rotateAdminKeyMutation.data.userAccessToken
                            .accessToken,
                        )}
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
                  <Alert variant="destructive">
                    <CircleAlertIcon className="size-5" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      This action will invalidate your current admin key and all
                      existing access tokens. You will need to update your
                      backend to use these new access tokens.
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
                    disabled={rotateAdminKeyMutation.isPending}
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
