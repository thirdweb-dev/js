"use client";

import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAccessToken,
  revokeAccessToken,
  listAccessTokens,
} from "@thirdweb-dev/vault-sdk";
import { createVaultClient } from "@thirdweb-dev/vault-sdk";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { THIRDWEB_VAULT_URL } from "../../../../../../../@/constants/env";

export default function ListAccessTokensButton(props: {
  projectId: string;
  teamId: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [typedAdminKey, setTypedAdminKey] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [deletingTokenId, setDeletingTokenId] = useState<string | null>(null);

  // TODO allow passing permissions to the access token
  const createAccessTokenMutation = useMutation({
    mutationFn: async (args: { adminKey: string }) => {
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
              {
                type: "eoa:signStructuredMessage",
                structuredPatterns: {
                  useropV06: {},
                  useropV07: {},
                },
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
    onSuccess: () => {
      listAccessTokensQuery.refetch();
    },
  });

  const revokeAccessTokenMutation = useMutation({
    mutationFn: async (args: { adminKey: string; accessTokenId: string }) => {
      setDeletingTokenId(args.accessTokenId);
      const vaultClient = await createVaultClient({
        baseUrl: THIRDWEB_VAULT_URL,
      });

      const revokeAccessTokenRes = await revokeAccessToken({
        client: vaultClient,
        request: {
          options: {
            id: args.accessTokenId,
          },
          auth: {
            adminKey: args.adminKey,
          },
        },
      });

      if (!revokeAccessTokenRes.success) {
        throw new Error(
          `Failed to revoke access token: ${revokeAccessTokenRes.error.message}`,
        );
      }

      return {
        success: true,
      };
    },
    onError: (error) => {
      toast.error(error.message);
      setDeletingTokenId(null);
    },
    onSuccess: () => {
      listAccessTokensQuery.refetch();
      setDeletingTokenId(null);
    },
  });

  // Stub data for now
  const listAccessTokensQuery = useQuery({
    queryKey: ["list-access-tokens", maskSecret(adminKey)],
    queryFn: async () => {
      const vaultClient = await createVaultClient({
        baseUrl: THIRDWEB_VAULT_URL,
      });
      const listResult = await listAccessTokens({
        client: vaultClient,
        request: {
          auth: {
            adminKey,
          },
          options: {},
        },
      });

      if (!listResult.success) {
        throw new Error(
          `Failed to list access tokens: ${listResult.error.message}`,
        );
      }
      return {
        accessTokens: listResult.data.items.map((t) => ({
          key: t.id, // todo: the actual user-facing key is not returned by this yet, fix this
          id: t.id,
        })),
      };
      // Return stub data for now
    },
    enabled: !!adminKey,
  });

  const handleCloseModal = () => {
    setModalOpen(false);
    setAdminKey("");
    setTypedAdminKey("");
  };

  const isLoading = listAccessTokensQuery.isLoading;

  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => setModalOpen(true)}
        disabled={isLoading}
        className="flex flex-row items-center gap-2"
      >
        {isLoading && <Loader2 className="animate-spin" />}
        Manage Access Tokens
      </Button>

      <Dialog open={modalOpen} onOpenChange={handleCloseModal} modal={true}>
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="p-6">
            <DialogTitle>Vault Access Tokens</DialogTitle>
          </DialogHeader>
          {listAccessTokensQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 p-10">
              <Spinner className="size-8" />
              <DialogTitle>Loading access tokens</DialogTitle>
            </div>
          ) : listAccessTokensQuery.data ? (
            <div>
              <div className="space-y-6 p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-col gap-2">
                      {listAccessTokensQuery.data.accessTokens.map((token) => (
                        <div key={token.id} className="flex gap-2">
                          <CopyTextButton
                            textToCopy={token.key}
                            className="!h-auto flex-1 justify-between bg-background px-3 py-3 font-mono text-xs"
                            textToShow={maskSecret(token.key)}
                            copyIconPosition="right"
                            tooltip="Copy Vault Access Token"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-auto px-3 py-3"
                            onClick={() =>
                              revokeAccessTokenMutation.mutate({
                                adminKey,
                                accessTokenId: token.id,
                              })
                            }
                            disabled={deletingTokenId !== null}
                          >
                            {deletingTokenId === token.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                        onClick={() =>
                          createAccessTokenMutation.mutate({ adminKey })
                        }
                        disabled={createAccessTokenMutation.isPending}
                      >
                        {createAccessTokenMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating new access token...
                          </>
                        ) : (
                          <>
                            <span>+ Create new access token</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    These access tokens can be used for all server wallets
                    created within this project (more granular permissions
                    coming soon).
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
                <Button onClick={handleCloseModal} variant={"primary"}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-6 pb-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-warning-text">
                  This action requires your Vault admin key.
                </p>
                <Input
                  type="password"
                  placeholder="sa_adm_ABCD_1234..."
                  value={typedAdminKey}
                  onChange={(e) => setTypedAdminKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setAdminKey(typedAdminKey);
                    }
                  }}
                />
                <div className="flex justify-end gap-3">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setAdminKey("");
                      setTypedAdminKey("");
                      setModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"primary"}
                    onClick={() => {
                      setAdminKey(typedAdminKey);
                    }}
                    disabled={!typedAdminKey || listAccessTokensQuery.isLoading}
                  >
                    {listAccessTokensQuery.isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Manage Access Tokens"
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
