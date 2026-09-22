"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, LockIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  createVaultAccessToken,
  listVaultAccessTokens,
  revokeVaultAccessToken,
  type VaultCredentials,
} from "@/actions/vault";
import type { Project } from "@/api/project/projects";
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
import { cn } from "@/lib/utils";
import { toDateTimeLocal } from "@/utils/date-utils";

export default function ListAccessTokens(props: {
  project: Project;
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [typedUnlockKey, setTypedUnlockKey] = useState("");
  const [unlockKey, setUnlockKey] = useState("");
  const [deletingTokenId, setDeletingTokenId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const engineCloudService = props.project.services.find(
    (s) => s.name === "engineCloud",
  );
  const managementAccessToken = engineCloudService?.managementAccessToken;
  const isManagedVault = !!engineCloudService?.encryptedAdminKey;

  const projectRef = {
    projectId: props.project.id,
    teamId: props.project.teamId,
  };

  const credentials: VaultCredentials = isManagedVault
    ? { projectSecretKey: unlockKey || undefined }
    : { adminKey: unlockKey || undefined };

  // TODO allow passing permissions to the access token
  const createAccessTokenMutation = useMutation({
    mutationFn: async () => {
      return createVaultAccessToken({
        credentials,
        project: projectRef,
      });
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
    mutationFn: async (args: { accessTokenId: string }) => {
      setDeletingTokenId(args.accessTokenId);
      return revokeVaultAccessToken({
        accessTokenId: args.accessTokenId,
        credentials,
        project: projectRef,
      });
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

  const listAccessTokensQuery = useQuery({
    enabled: !!managementAccessToken,
    queryFn: async () => {
      return listVaultAccessTokens({
        credentials,
        project: projectRef,
      });
    },
    queryKey: ["list-access-tokens", props.project.id, maskSecret(unlockKey)],
  });

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card",
        props.className,
      )}
    >
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
              if (!unlockKey) {
                setModalOpen(true);
              } else {
                setUnlockKey("");
                setTypedUnlockKey("");
                queryClient.invalidateQueries({
                  queryKey: ["list-access-tokens"],
                });
              }
            }}
            variant={"primary"}
          >
            <LockIcon className="h-4 w-4" />{" "}
            {unlockKey ? "Lock Vault" : "Unlock Vault"}
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
              {isManagedVault
                ? "Failed to list access tokens. Check your project secret key and try again."
                : "Failed to list access tokens. Check your admin key and try again."}
            </p>
          </div>
        ) : listAccessTokensQuery.data?.accessTokens.length ? (
          <div>
            <div className="space-y-6 pt-0">
              <div className="space-y-4">
                <div>
                  <div className="flex flex-col gap-2">
                    {listAccessTokensQuery.data.accessTokens.map((token) => (
                      <div className="flex gap-2" key={token.id}>
                        <div className="flex max-w-full flex-1 flex-col justify-between gap-4 rounded-lg border border-border bg-background p-4 text-xs">
                          <h4 className="font-bold">
                            {token.purpose || "Unnamed Access Token"}
                          </h4>
                          <div className="flex flex-row items-center gap-2">
                            {token.accessToken ? (
                              <CopyTextButton
                                className="!h-auto min-w-0 flex-grow justify-between bg-background px-3 py-3 font-mono text-xs"
                                copyIconPosition="right"
                                textToCopy={token.accessToken}
                                textToShow={token.accessToken}
                                tooltip="Copy Vault Access Token"
                              />
                            ) : (
                              <div className="flex flex-grow flex-row items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm">
                                <p className="text-muted-foreground text-sm">
                                  {token.maskedAccessToken}{" "}
                                  <span className="text-muted-foreground text-xs">
                                    (unlock vault to reveal the full token)
                                  </span>
                                </p>
                              </div>
                            )}
                            <Button
                              className="px-3 py-3"
                              disabled={
                                deletingTokenId !== null ||
                                revokeAccessTokenMutation.isPending ||
                                !unlockKey
                              }
                              onClick={() =>
                                revokeAccessTokenMutation.mutate({
                                  accessTokenId: token.id,
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
            disabled={createAccessTokenMutation.isPending || !unlockKey}
            onClick={() => createAccessTokenMutation.mutate()}
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
                  <LockIcon className="h-4 w-4" /> This action requires your{" "}
                  {isManagedVault ? "project secret key" : "Vault admin key"}.
                </p>
                <Input
                  onChange={(e) => setTypedUnlockKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setUnlockKey(typedUnlockKey);
                      handleCloseModal();
                    }
                  }}
                  placeholder={
                    isManagedVault
                      ? "Your project secret key"
                      : "sa_adm_ABCD_1234..."
                  }
                  type="password"
                  value={typedUnlockKey}
                />
              </div>
              <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
                <Button
                  onClick={() => {
                    setUnlockKey("");
                    setTypedUnlockKey("");
                    setModalOpen(false);
                  }}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!typedUnlockKey || listAccessTokensQuery.isLoading}
                  onClick={() => {
                    setUnlockKey(typedUnlockKey);
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
