"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listAccessTokens, revokeAccessToken } from "@thirdweb-dev/vault-sdk";
import { Loader2Icon, LockIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { toDateTimeLocal } from "utils/date-utils";
import type { Project } from "@/api/projects";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createWalletAccessToken,
  initVaultClient,
  SERVER_WALLET_MANAGEMENT_ACCESS_TOKEN_PURPOSE,
} from "../../transactions/lib/vault.client";

export default function ListAccessTokens(props: { project: Project }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [typedAdminKey, setTypedAdminKey] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [deletingTokenId, setDeletingTokenId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // TODO allow passing permissions to the access token
  const createAccessTokenMutation = useMutation({
    mutationFn: async (args: { adminKey: string }) => {
      const vaultClient = await initVaultClient();

      const userAccessTokenRes = await createWalletAccessToken({
        adminKey: args.adminKey,
        project: props.project,
        vaultClient,
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
      queryClient.invalidateQueries({
        queryKey: ["list-access-tokens"],
      });
    },
  });

  const revokeAccessTokenMutation = useMutation({
    mutationFn: async (args: { adminKey: string; accessTokenId: string }) => {
      setDeletingTokenId(args.accessTokenId);
      const vaultClient = await initVaultClient();

      const revokeAccessTokenRes = await revokeAccessToken({
        client: vaultClient,
        request: {
          auth: {
            adminKey: args.adminKey,
          },
          options: {
            id: args.accessTokenId,
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
      queryClient.invalidateQueries({
        queryKey: ["list-access-tokens"],
      });
      setDeletingTokenId(null);
    },
  });

  const managementAccessToken = props.project.services.find(
    (s) => s.name === "engineCloud",
  )?.managementAccessToken;

  const listAccessTokensQuery = useQuery({
    enabled: !!managementAccessToken,
    queryFn: async () => {
      if (!managementAccessToken) {
        throw new Error("Management access token not found");
      }
      const vaultClient = await initVaultClient();
      const listResult = await listAccessTokens({
        client: vaultClient,
        request: {
          auth: adminKey
            ? {
                adminKey,
              }
            : {
                accessToken: managementAccessToken,
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
        accessTokens: listResult.data.items
          .filter(
            (t) =>
              t.metadata?.purpose?.toString() !==
              SERVER_WALLET_MANAGEMENT_ACCESS_TOKEN_PURPOSE,
          )
          .filter((t) => !t.revokedAt && !t.isRotated),
      };
      // Return stub data for now
    },
    queryKey: [
      "list-access-tokens",
      maskSecret(managementAccessToken || ""),
      maskSecret(adminKey),
    ],
  });

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-col px-6 pt-6">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <h2 className="font-semibold text-xl tracking-tight">
              Access Tokens
            </h2>
            <p className="text-muted-foreground text-sm">
              Access tokens let you sign transactions using any of your server
              wallets.
            </p>
          </div>
          <Button
            className="flex flex-row items-center gap-2"
            onClick={() => {
              if (!adminKey) {
                setModalOpen(true);
              } else {
                setAdminKey("");
                setTypedAdminKey("");
                queryClient.invalidateQueries({
                  queryKey: ["list-access-tokens"],
                });
              }
            }}
            variant={"primary"}
          >
            <LockIcon className="h-4 w-4" />{" "}
            {adminKey ? "Lock Vault" : "Unlock Vault"}
          </Button>
        </div>
        <div className="h-4" />
        {listAccessTokensQuery.isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 p-10">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : listAccessTokensQuery.error ? (
          <div className="flex flex-col gap-4">
            <p className="text-destructive-text text-sm">
              Failed to list access tokens. Check your admin key and try again.
            </p>
          </div>
        ) : listAccessTokensQuery.data ? (
          <div>
            <div className="space-y-6 pt-0">
              <div className="space-y-4">
                <div>
                  <div className="flex flex-col gap-2">
                    {listAccessTokensQuery.data.accessTokens.map((token) => (
                      <div className="flex gap-2" key={token.id}>
                        <div className="flex max-w-full flex-1 flex-col justify-between gap-4 rounded-lg border border-border bg-background p-4 text-xs">
                          <h4 className="font-bold">
                            {token.metadata?.purpose || "Unnamed Access Token"}
                          </h4>
                          <div className="flex flex-row items-center gap-2">
                            {token.accessToken.includes("**") ? (
                              <div className="flex flex-grow flex-row items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm">
                                <p className="text-muted-foreground text-sm">
                                  {token.accessToken}{" "}
                                  <span className="text-muted-foreground text-xs">
                                    (unlock vault to reveal the full token)
                                  </span>
                                </p>
                              </div>
                            ) : (
                              <CopyTextButton
                                className="!h-auto min-w-0 flex-grow justify-between bg-background px-3 py-3 font-mono text-xs"
                                copyIconPosition="right"
                                textToCopy={token.accessToken}
                                textToShow={token.accessToken}
                                tooltip="Copy Vault Access Token"
                              />
                            )}
                            <Button
                              className="px-3 py-3"
                              disabled={
                                deletingTokenId !== null ||
                                revokeAccessTokenMutation.isPending ||
                                !adminKey
                              }
                              onClick={() =>
                                revokeAccessTokenMutation.mutate({
                                  accessTokenId: token.id,
                                  adminKey,
                                })
                              }
                              size="sm"
                              variant="destructive"
                            >
                              {deletingTokenId === token.id ? (
                                <Loader2Icon className="size-4 animate-spin" />
                              ) : (
                                <Trash2Icon className="size-4" />
                              )}
                            </Button>
                          </div>
                          {/* TODO (cloud): show policies and let you edit them */}
                          <p className="text-muted-foreground text-xs">
                            Created on:{" "}
                            {toDateTimeLocal(new Date(token.createdAt))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              No access tokens found.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 bg-card py-4">
          <Button
            disabled={createAccessTokenMutation.isPending || !adminKey}
            onClick={() => createAccessTokenMutation.mutate({ adminKey })}
            variant={"primary"}
          >
            {createAccessTokenMutation.isPending ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Creating new access token...
              </>
            ) : (
              "Create new access token"
            )}
          </Button>
        </div>

        <Dialog modal={true} onOpenChange={handleCloseModal} open={modalOpen}>
          <DialogContent className="overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Unlock Vault</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 px-6">
                <p className="flex items-center gap-2 text-sm text-warning-text">
                  <LockIcon className="h-4 w-4" /> This action requires your
                  Vault admin key.
                </p>
                <Input
                  onChange={(e) => setTypedAdminKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setAdminKey(typedAdminKey);
                    }
                  }}
                  placeholder="sa_adm_ABCD_1234..."
                  type="password"
                  value={typedAdminKey}
                />
              </div>
              <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
                <Button
                  onClick={() => {
                    setAdminKey("");
                    setTypedAdminKey("");
                    setModalOpen(false);
                  }}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!typedAdminKey || listAccessTokensQuery.isLoading}
                  onClick={() => {
                    setAdminKey(typedAdminKey);
                    handleCloseModal();
                  }}
                  variant={"primary"}
                >
                  Unlock Vault
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function maskSecret(secret: string) {
  return `${secret.substring(0, 10)}...${secret.substring(secret.length - 10)}`;
}
