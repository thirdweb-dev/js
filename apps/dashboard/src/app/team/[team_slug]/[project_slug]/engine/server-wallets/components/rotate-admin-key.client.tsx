"use client";

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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  createVaultClient,
  rotateServiceAccount,
} from "@thirdweb-dev/vault-sdk";
import { Loader2, LockIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { THIRDWEB_VAULT_URL } from "../../../../../../../@/constants/env";

export default function RotateAdminKeyButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rotationCode, setRotationCode] = useState("");
  const [keysConfirmed, setKeysConfirmed] = useState(false);

  const rotateAdminKeyMutation = useMutation({
    mutationFn: async () => {
      if (!rotationCode) {
        throw new Error("Rotation code is required");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const client = await createVaultClient({
        baseUrl: THIRDWEB_VAULT_URL,
      });

      const rotateServiceAccountRes = await rotateServiceAccount({
        client,
        request: {
          auth: {
            rotationCode,
          },
        },
      });

      if (rotateServiceAccountRes.error) {
        throw new Error(rotateServiceAccountRes.error.message);
      }

      return {
        success: true,
        adminKey: rotateServiceAccountRes.data.newAdminKey,
        rotationKey: rotateServiceAccountRes.data.newRotationCode,
      };
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCloseModal = () => {
    if (!keysConfirmed) {
      return;
    }
    setModalOpen(false);
    setRotationCode("");
    setKeysConfirmed(false);
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
                      New Rotation Key
                    </h3>
                    <div className="flex flex-col gap-2">
                      <CopyTextButton
                        textToCopy={rotateAdminKeyMutation.data.rotationKey}
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        textToShow={maskSecret(
                          rotateAdminKeyMutation.data.rotationKey,
                        )}
                        copyIconPosition="right"
                        tooltip="Copy Rotation Key"
                      />
                      <p className="text-muted-foreground text-xs">
                        This key is used to rotate your admin key in the future.
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
              <DialogHeader className="p-6">
                <DialogTitle>Rotate your Vault admin key</DialogTitle>
                <DialogDescription>
                  This action will generate a new Vault admin key and rotation
                  code. This will invalidate all existing access tokens.
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 pb-6">
                <div className="flex flex-col gap-4">
                  <p className="flex items-center gap-2 text-sm text-warning-text">
                    <LockIcon className="h-4 w-4" /> This action requires your
                    Vault rotation code.
                  </p>
                  <Input
                    type="password"
                    placeholder="sa_rot_ABCD_1234..."
                    value={rotationCode}
                    onChange={(e) => setRotationCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        rotateAdminKeyMutation.mutate();
                      }
                    }}
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRotationCode("");
                        setModalOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => rotateAdminKeyMutation.mutate()}
                      disabled={
                        !rotationCode || rotateAdminKeyMutation.isPending
                      }
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function maskSecret(secret: string) {
  return `${secret.substring(0, 11)}...${secret.substring(secret.length - 5)}`;
}
