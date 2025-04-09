"use client";

import { Button } from "@/components/ui/button";
import { THIRDWEB_VAULT_URL } from "@/constants/env";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { updateProjectClient } from "@3rdweb-sdk/react/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import {
  createAccessToken,
  createEoa,
  createServiceAccount,
  createVaultClient,
} from "@thirdweb-dev/vault-sdk";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateServerWallet(props: {
  projectId: string;
  teamId: string;
  managementAccessToken: string | undefined;
}) {
  const router = useDashboardRouter();

  const initialiseProjectWithVaultMutation = useMutation({
    mutationFn: async () => {
      const vaultClient = await createVaultClient({
        baseUrl: THIRDWEB_VAULT_URL,
      });

      const serviceAccount = await createServiceAccount({
        client: vaultClient,
        request: {
          options: {
            metadata: {
              projectId: props.projectId,
              teamId: props.teamId,
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
            ],
            metadata: {
              projectId: props.projectId,
              teamId: props.teamId,
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

      console.log(JSON.stringify(userAccessTokenRes.data, null, 2));
      console.log(JSON.stringify(serviceAccount.data, null, 2));
      console.log(JSON.stringify(managementAccessTokenRes.data, null, 2));

      const apiServerResult = await updateProjectClient(
        {
          projectId: props.projectId,
          teamId: props.teamId,
        },
        {
          services: [
            {
              name: "engineCloud",
              managementAccessToken: managementAccessTokenRes.data.accessToken,
              maskedAdminKey: maskSecret(serviceAccount.data.adminKey),
              actions: [],
            },
          ],
        },
      );

      console.log(apiServerResult);

      // todo: show modal with credentials here
      // This should display:
      // - Service Account Admin Key
      // - Service Account Rotation Code
      // - "Project Level" Access Token: this allows all EOA operations for this service account, scoped to type, teamId and projectId by metadata
      return {
        serviceAccount: serviceAccount.data,
        userAccessToken: userAccessTokenRes.data,
        managementAccessToken: managementAccessTokenRes.data,
      };
    },
    onError: (error) => {
      toast.error(error.message);
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
              projectId: props.projectId,
              teamId: props.teamId,
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

      console.log(JSON.stringify(eoa.data, null, 2));

      router.refresh();

      return eoa;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <Button
        variant={"primary"}
        onClick={async () => {
          if (!props.managementAccessToken) {
            const initResult =
              await initialiseProjectWithVaultMutation.mutateAsync();
            await createEoaMutation.mutateAsync({
              managementAccessToken:
                initResult.managementAccessToken.accessToken,
            });
          } else {
            await createEoaMutation.mutateAsync({
              managementAccessToken: props.managementAccessToken,
            });
          }
        }}
        disabled={initialiseProjectWithVaultMutation.isPending}
      >
        {initialiseProjectWithVaultMutation.isPending && (
          <Loader2 className="animate-spin" />
        )}
        Create Server Wallet
      </Button>
      {initialiseProjectWithVaultMutation.data ? (
        <div>
          Success! <h1>Admin Key</h1>
          <p>
            {initialiseProjectWithVaultMutation.data.serviceAccount.adminKey}
          </p>
          <h1>Rotation Code</h1>
          <p>
            {
              initialiseProjectWithVaultMutation.data.serviceAccount
                .rotationCode
            }
          </p>
          <h1>Access Token</h1>
          <p>
            {
              initialiseProjectWithVaultMutation.data.userAccessToken
                .accessToken
            }
          </p>
          <h1>Management Access Token</h1>
          <p>
            {
              initialiseProjectWithVaultMutation.data.managementAccessToken
                .accessToken
            }
          </p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

function maskSecret(secret: string) {
  return `${secret.substring(0, 13)}...${secret.substring(secret.length - 4)}`;
}
