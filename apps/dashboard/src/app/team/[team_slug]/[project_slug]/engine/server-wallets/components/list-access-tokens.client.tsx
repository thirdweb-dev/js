"use client";
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
import { listAccessTokens, revokeAccessToken } from "@thirdweb-dev/vault-sdk";
import { Loader2, LockIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "../../../../../../../@/api/projects";
import { CopyTextButton } from "../../../../../../../@/components/ui/CopyTextButton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../../../../@/components/ui/alert";
import { Badge } from "../../../../../../../@/components/ui/badge";
import {
  Checkbox,
  CheckboxWithLabel,
} from "../../../../../../../@/components/ui/checkbox";
import { toDateTimeLocal } from "../../../../../../../utils/date-utils";
import {
  SERVER_WALLET_MANAGEMENT_ACCESS_TOKEN_PURPOSE,
  createWalletAccessToken,
  initVaultClient,
} from "../../lib/vault-utils";

export default function ListAccessTokensButton(props: {
  project: Project;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [typedAdminKey, setTypedAdminKey] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [deletingTokenId, setDeletingTokenId] = useState<string | null>(null);
  const [newAccessToken, setNewAccessToken] = useState<string | null>(null);
  const [keysConfirmed, setKeysConfirmed] = useState(false);
  // TODO allow passing permissions to the access token
  const createAccessTokenMutation = useMutation({
    mutationFn: async (args: { adminKey: string }) => {
      const vaultClient = await initVaultClient();

      const userAccessTokenRes = await createWalletAccessToken({
        project: props.project,
        adminKey: args.adminKey,
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
    onSuccess: (data) => {
      setNewAccessToken(data.userAccessToken.accessToken);
      listAccessTokensQuery.refetch();
    },
  });

  const revokeAccessTokenMutation = useMutation({
    mutationFn: async (args: { adminKey: string; accessTokenId: string }) => {
      setDeletingTokenId(args.accessTokenId);
      const vaultClient = await initVaultClient();

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
    queryKey: ["list-access-tokensq", maskSecret(adminKey)],
    queryFn: async () => {
      const vaultClient = await initVaultClient();
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
        accessTokens: listResult.data.items
          .filter(
            (t) =>
              t.metadata?.purpose?.toString() !==
              SERVER_WALLET_MANAGEMENT_ACCESS_TOKEN_PURPOSE,
          )
          .filter((t) => !t.revokedAt),
      };
      // Return stub data for now
    },
    enabled: !!adminKey,
  });

  const handleCloseModal = () => {
    setModalOpen(false);
    setAdminKey("");
    setTypedAdminKey("");
    setNewAccessToken(null);
    setKeysConfirmed(false);
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
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Vault Access Tokens</DialogTitle>
          </DialogHeader>
          {/* If new access token, show copy button */}
          {newAccessToken ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 px-6 ">
                <p className="text-muted-foreground text-xs">
                  Here's your new access token. Store it securely as it will not
                  be displayed again.
                </p>
                <CopyTextButton
                  textToCopy={newAccessToken}
                  className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                  textToShow={maskSecret(newAccessToken)}
                  copyIconPosition="right"
                  tooltip="Copy Vault Access Token"
                />
                <p className="text-muted-foreground text-xs">
                  This access token is used to sign transactions and messages
                  from your backend. Can be revoked and recreated with your
                  admin key.
                </p>
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
                  onClick={() => {
                    setNewAccessToken(null);
                    setKeysConfirmed(false);
                  }}
                  disabled={!keysConfirmed}
                  variant={"primary"}
                >
                  Go Back
                </Button>
              </div>
            </div>
          ) : listAccessTokensQuery.isLoading ? (
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
                          <div className="flex flex-1 flex-col justify-between gap-4 rounded-lg border border-border bg-background px-3 py-3 text-xs">
                            <h4 className="font-bold">
                              {token.metadata?.purpose ||
                                "Unnamed Access Token"}
                            </h4>
                            <div className="flex flex-row flex-wrap gap-2">
                              {token.policies.map((policy) => (
                                <Badge
                                  key={policy.type}
                                  variant={"outline"}
                                  className="font-mono"
                                >
                                  {policy.type}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-muted-foreground text-xs">
                              Created on:{" "}
                              {toDateTimeLocal(new Date(token.createdAt))}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="px-3 py-3"
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
                <Button onClick={handleCloseModal} variant={"outline"}>
                  Close
                </Button>
                <Button
                  onClick={() => createAccessTokenMutation.mutate({ adminKey })}
                  disabled={createAccessTokenMutation.isPending}
                  variant={"primary"}
                >
                  {createAccessTokenMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating new access token...
                    </>
                  ) : (
                    "Create new access token"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 px-6">
                <p className="flex items-center gap-2 text-sm text-warning-text">
                  <LockIcon className="h-4 w-4" /> This action requires your
                  Vault admin key.
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
              </div>
              <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function maskSecret(secret: string) {
  return `${secret.substring(0, 10)}...${secret.substring(secret.length - 10)}`;
}
