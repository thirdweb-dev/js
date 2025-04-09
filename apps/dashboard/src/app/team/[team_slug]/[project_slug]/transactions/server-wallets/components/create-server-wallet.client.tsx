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
import { THIRDWEB_VAULT_URL } from "@/constants/env";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { updateProjectClient } from "@3rdweb-sdk/react/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import {
  createAccessToken,
  createEoa,
  createServiceAccount,
  createVaultClient,
} from "@thirdweb-dev/vault-sdk";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateServerWallet(props: {
  project: Project;
  managementAccessToken: string | undefined;
}) {
  const router = useDashboardRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [keysConfirmed, setKeysConfirmed] = useState(false);

  const initialiseProjectWithVaultMutation = useMutation({
    mutationFn: async () => {
      setModalOpen(true);

      const vaultClient = await createVaultClient({
        baseUrl: THIRDWEB_VAULT_URL,
      });

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

      const managementAccessTokenPromise = createAccessToken({
        client: vaultClient,
        request: {
          options: {
            expiresAt: new Date(
              Date.now() + 60 * 60 * 1000 * 24 * 365 * 1000,
            ).toISOString(), // 100 years from now
            policies: [
              {
                type: "eoa:read",
                metadataPatterns: [
                  {
                    key: "projectId",
                    rule: {
                      pattern: props.project.id,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.project.teamId,
                    },
                  },
                  {
                    key: "type",
                    rule: {
                      pattern: "server-wallet",
                    },
                  },
                ],
              },
              {
                type: "eoa:create",
                requiredMetadataPatterns: [
                  {
                    key: "projectId",
                    rule: {
                      pattern: props.project.id,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.project.teamId,
                    },
                  },
                  {
                    key: "type",
                    rule: {
                      pattern: "server-wallet",
                    },
                  },
                ],
              },
            ],
            metadata: {
              projectId: props.project.id,
              teamId: props.project.teamId,
              purpose: "Thirdweb Project Server Wallet Access Token",
            },
          },
          auth: {
            adminKey: serviceAccount.data.adminKey,
          },
        },
      });

      const userAccesTokenPromise = createAccessToken({
        client: vaultClient,
        request: {
          options: {
            expiresAt: new Date(
              Date.now() + 60 * 60 * 1000 * 24 * 365 * 1000,
            ).toISOString(), // 100 years from now
            policies: [
              {
                type: "eoa:read",
                metadataPatterns: [
                  {
                    key: "projectId",
                    rule: {
                      pattern: props.project.id,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.project.teamId,
                    },
                  },
                  {
                    key: "type",
                    rule: {
                      pattern: "server-wallet",
                    },
                  },
                ],
              },
              {
                type: "eoa:create",
                requiredMetadataPatterns: [
                  {
                    key: "projectId",
                    rule: {
                      pattern: props.project.id,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.project.teamId,
                    },
                  },
                  {
                    key: "type",
                    rule: {
                      pattern: "server-wallet",
                    },
                  },
                ],
              },
              {
                type: "eoa:signMessage",
                metadataPatterns: [
                  {
                    key: "projectId",
                    rule: {
                      pattern: props.project.id,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.project.teamId,
                    },
                  },
                  {
                    key: "type",
                    rule: {
                      pattern: "server-wallet",
                    },
                  },
                ],
              },
              {
                type: "eoa:signTransaction",
                payloadPatterns: {},
                metadataPatterns: [
                  {
                    key: "projectId",
                    rule: {
                      pattern: props.project.id,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.project.teamId,
                    },
                  },
                  {
                    key: "type",
                    rule: {
                      pattern: "server-wallet",
                    },
                  },
                ],
              },
              {
                type: "eoa:signTypedData",
                metadataPatterns: [
                  {
                    key: "projectId",
                    rule: {
                      pattern: props.project.id,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.project.teamId,
                    },
                  },
                  {
                    key: "type",
                    rule: {
                      pattern: "server-wallet",
                    },
                  },
                ],
              },
            ],
            metadata: {
              projectId: props.project.id,
              teamId: props.project.teamId,
              purpose: "Thirdweb Project Server Wallet Access Token",
            },
          },
          auth: {
            adminKey: serviceAccount.data.adminKey,
          },
        },
      });

      const [userAccessTokenRes, managementAccessTokenRes] = await Promise.all([
        userAccesTokenPromise,
        managementAccessTokenPromise,
      ]);

      if (!managementAccessTokenRes.success || !userAccessTokenRes.success) {
        throw new Error("Failed to create access token");
      }

      // store the management access token in the project
      await updateProjectClient(
        {
          projectId: props.project.id,
          teamId: props.project.teamId,
        },
        {
          services: [
            ...props.project.services,
            {
              name: "engineCloud",
              managementAccessToken: managementAccessTokenRes.data.accessToken,
              maskedAdminKey: maskSecret(serviceAccount.data.adminKey),
              actions: [],
            },
          ],
        },
      );

      return {
        serviceAccount: serviceAccount.data,
        userAccessToken: userAccessTokenRes.data,
        managementAccessToken: managementAccessTokenRes.data,
      };
    },
    onError: (error) => {
      toast.error(error.message);
      setModalOpen(false);
    },
  });

  const createEoaMutation = useMutation({
    mutationFn: async ({
      managementAccessToken,
    }: {
      managementAccessToken: string;
    }) => {
      const vaultClient = await createVaultClient({
        baseUrl: THIRDWEB_VAULT_URL,
      });

      const eoa = await createEoa({
        request: {
          options: {
            metadata: {
              projectId: props.project.id,
              teamId: props.project.teamId,
              type: "server-wallet",
            },
          },
          auth: {
            accessToken: managementAccessToken,
          },
        },
        client: vaultClient,
      });

      if (!eoa.success) {
        throw new Error("Failed to create eoa");
      }

      router.refresh();

      return eoa;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateServerWallet = async () => {
    // FIXME uncomment this
    // if (!props.managementAccessToken) {
    const initResult = await initialiseProjectWithVaultMutation.mutateAsync();
    await createEoaMutation.mutateAsync({
      managementAccessToken: initResult.managementAccessToken.accessToken,
    });
    // } else {
    // await createEoaMutation.mutateAsync({
    // managementAccessToken: props.managementAccessToken,
    // });
    // }
  };

  const handleCloseModal = () => {
    if (!keysConfirmed) {
      return;
    }
    setModalOpen(false);
    setKeysConfirmed(false);
  };

  const isLoading =
    initialiseProjectWithVaultMutation.isPending || createEoaMutation.isPending;

  return (
    <>
      <Button
        variant={"primary"}
        onClick={handleCreateServerWallet}
        disabled={isLoading}
        className="flex flex-row items-center gap-2"
      >
        {isLoading && <Loader2 className="animate-spin" />}
        Create Server Wallet
      </Button>

      <Dialog open={modalOpen} onOpenChange={handleCloseModal} modal={true}>
        <DialogContent
          className="overflow-hidden p-0"
          dialogCloseClassName={cn(!keysConfirmed && "hidden")}
        >
          {initialiseProjectWithVaultMutation.isPending ? (
            <>
              <DialogHeader className="p-6">
                <DialogTitle>
                  Generating your wallet management keys
                </DialogTitle>
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
                <DialogTitle>Wallet Management Keys</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium text-sm">Admin Key</h3>
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
                    <h3 className="mb-2 font-medium text-sm">Rotation Code</h3>
                    <div className="flex flex-col gap-2">
                      <CopyTextButton
                        textToCopy={
                          initialiseProjectWithVaultMutation.data.serviceAccount
                            .rotationCode
                        }
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        textToShow={maskSecret(
                          initialiseProjectWithVaultMutation.data.serviceAccount
                            .rotationCode,
                        )}
                        copyIconPosition="right"
                        tooltip="Copy Rotation Code"
                      />
                      <p className="text-muted-foreground text-xs">
                        This code is used to rotate your admin key in case you
                        loose it.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-sm">
                      Wallet Access Token
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
                        tooltip="Copy Wallet Access Token"
                      />
                      <p className="text-muted-foreground text-xs">
                        This access token is used to send transactions to the
                        blockchain from your backend. Can be revoked and
                        recreated with your admin key.
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

function maskSecret(secret: string) {
  return `${secret.substring(0, 11)}...${secret.substring(secret.length - 5)}`;
}
