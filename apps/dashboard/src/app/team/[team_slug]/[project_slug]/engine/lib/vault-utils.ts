import type { Project } from "@/api/projects";
import { THIRDWEB_VAULT_URL } from "@/constants/env";
import {
  type VaultClient,
  createAccessToken,
  createVaultClient,
} from "@thirdweb-dev/vault-sdk";
import { updateProjectClient } from "../../../../../../@3rdweb-sdk/react/hooks/useApi";

const SERVER_WALLET_ACCESS_TOKEN_PURPOSE =
  "Access Token for All Server Wallets";

export const SERVER_WALLET_MANAGEMENT_ACCESS_TOKEN_PURPOSE =
  "Management Token for Dashboard";

let vaultClient: VaultClient | null = null;

export async function initVaultClient() {
  if (vaultClient) {
    return vaultClient;
  }
  vaultClient = await createVaultClient({
    baseUrl: THIRDWEB_VAULT_URL,
  });
  return vaultClient;
}

export async function createWalletAccessToken(props: {
  project: Project;
  adminKey: string;
  vaultClient: VaultClient;
}) {
  return createAccessToken({
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
          purpose: SERVER_WALLET_ACCESS_TOKEN_PURPOSE,
        },
      },
      auth: {
        adminKey: props.adminKey,
      },
    },
  });
}

export async function createManagementAccessToken(props: {
  project: Project;
  adminKey: string;
  vaultClient: VaultClient;
}) {
  const res = await createAccessToken({
    client: props.vaultClient,
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
          purpose: SERVER_WALLET_MANAGEMENT_ACCESS_TOKEN_PURPOSE,
        },
      },
      auth: {
        adminKey: props.adminKey,
      },
    },
  });
  if (res.success) {
    const data = res.data;
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
            managementAccessToken: data.accessToken,
            maskedAdminKey: maskSecret(props.adminKey),
            actions: [],
          },
        ],
      },
    );
  }
  return res;
}

export function maskSecret(secret: string) {
  return `${secret.substring(0, 11)}...${secret.substring(secret.length - 5)}`;
}
