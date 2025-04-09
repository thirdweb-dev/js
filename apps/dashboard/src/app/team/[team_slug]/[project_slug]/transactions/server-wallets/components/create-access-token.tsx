"use client";

import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { THIRDWEB_VAULT_URL } from "@/constants/env";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createAccessToken, createVaultClient } from "@thirdweb-dev/vault-sdk";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateAccessToken(props: {
  projectId: string;
  teamId: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [keysConfirmed, setKeysConfirmed] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  // TODO allow passing permissions to the access token
  const createAccessTokenMutation = useMutation({
    mutationFn: async (args: {
      adminKey: string;
    }) => {
      const vaultClient = await createVaultClient({
        baseUrl: THIRDWEB_VAULT_URL,
      });

      const userAccessTokenRes = await createAccessToken({
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
                      pattern: props.projectId,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.teamId,
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
                      pattern: props.projectId,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.teamId,
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
                      pattern: props.projectId,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.teamId,
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
                      pattern: props.projectId,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.teamId,
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
                      pattern: props.projectId,
                    },
                  },
                  {
                    key: "teamId",
                    rule: {
                      pattern: props.teamId,
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
              projectId: props.projectId,
              teamId: props.teamId,
              purpose: "Thirdweb Project Server Wallet Access Token",
            },
          },
          auth: {
            adminKey: args.adminKey,
          },
        },
      });

      if (!userAccessTokenRes.success) {
        throw new Error(
          `Failed to create access token: ${userAccessTokenRes.error.message}`,
        );
      }

      return {
        userAccessToken: userAccessTokenRes.data,
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
    setKeysConfirmed(false);
  };

  const isLoading = createAccessTokenMutation.isPending;

  return (
    <>
      <Button
        variant={"secondary"}
        onClick={() => setModalOpen(true)}
        disabled={isLoading}
        className="flex flex-row items-center gap-2"
      >
        {isLoading && <Loader2 className="animate-spin" />}
        Create Access Token
      </Button>

      <Dialog open={modalOpen} onOpenChange={handleCloseModal} modal={true}>
        <DialogContent
          className="overflow-hidden p-0"
          dialogCloseClassName={cn(!keysConfirmed && "hidden")}
        >
          <DialogHeader className="p-6">
            <DialogTitle>Create Wallet Access Token</DialogTitle>
          </DialogHeader>
          {createAccessTokenMutation.isPending ? (
            <div className="flex flex-col items-center justify-center gap-4 p-10">
              <Spinner className="size-8" />
              <DialogTitle>Generating your access token</DialogTitle>
            </div>
          ) : createAccessTokenMutation.data ? (
            <div>
              <div className="space-y-6 p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium text-sm">
                      Wallet Access Token
                    </h3>
                    <div className="flex flex-col gap-2">
                      <CopyTextButton
                        textToCopy={
                          createAccessTokenMutation.data.userAccessToken
                            .accessToken
                        }
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        textToShow={maskSecret(
                          createAccessTokenMutation.data.userAccessToken
                            .accessToken,
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
          ) : (
            <div className="px-6 pb-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-warning-text">
                  This action requries your admin key.
                </p>
                <Input
                  type="password"
                  placeholder="Enter your admin key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setAdminKey("");
                      setModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"primary"}
                    onClick={() =>
                      createAccessTokenMutation.mutate({ adminKey })
                    }
                    disabled={!adminKey || createAccessTokenMutation.isPending}
                  >
                    {createAccessTokenMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function maskSecret(secret: string) {
  return `${secret.substring(0, 10)}...${secret.substring(secret.length - 10)}`;
}
