"use client";

import {
  createAccessToken,
  createVaultClient,
  type VaultClient,
} from "@thirdweb-dev/vault-sdk";
import type { Project } from "@/api/projects";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import { updateProjectClient } from "@/hooks/useApi";

const SERVER_WALLET_ACCESS_TOKEN_PURPOSE =
  "Access Token for All Server Wallets";

export const SERVER_WALLET_MANAGEMENT_ACCESS_TOKEN_PURPOSE =
  "Management Token for Dashboard";

let vc: VaultClient | null = null;

export async function initVaultClient() {
  if (vc) {
    return vc;
  }
  vc = await createVaultClient({
    baseUrl: NEXT_PUBLIC_THIRDWEB_VAULT_URL,
  });
  return vc;
}

export async function createWalletAccessToken(props: {
  project: Project;
  adminKey: string;
  vaultClient: VaultClient;
}) {
  return createAccessToken({
    client: props.vaultClient,
    request: {
      auth: {
        adminKey: props.adminKey,
      },
      options: {
        expiresAt: new Date(
          Date.now() + 60 * 60 * 1000 * 24 * 365 * 1000,
        ).toISOString(), // 100 years from now
        metadata: {
          projectId: props.project.id,
          purpose: SERVER_WALLET_ACCESS_TOKEN_PURPOSE,
          teamId: props.project.teamId,
        },
        policies: [
          {
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
            type: "eoa:read",
          },
          {
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
            type: "eoa:create",
          },
          {
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
            type: "eoa:signMessage",
          },
          {
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
            payloadPatterns: {},
            type: "eoa:signTransaction",
          },
          {
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
            type: "eoa:signTypedData",
          },
          {
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
            structuredPatterns: {
              useropV06: {},
              useropV07: {},
            },
            type: "eoa:signStructuredMessage",
          },
          {
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
            type: "eoa:read",
          },
          {
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
            type: "eoa:create",
          },
        ],
      },
    },
  });
}

export async function createManagementAccessToken(props: {
  project: Project;
  adminKey: string;
  rotationCode: string;
  vaultClient: VaultClient;
}) {
  const res = await createAccessToken({
    client: props.vaultClient,
    request: {
      auth: {
        adminKey: props.adminKey,
      },
      options: {
        expiresAt: new Date(
          Date.now() + 60 * 60 * 1000 * 24 * 365 * 1000,
        ).toISOString(), // 100 years from now
        metadata: {
          projectId: props.project.id,
          purpose: SERVER_WALLET_MANAGEMENT_ACCESS_TOKEN_PURPOSE,
          teamId: props.project.teamId,
        },
        policies: [
          {
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
            type: "eoa:read",
          },
          {
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
            type: "eoa:create",
          },
          {
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
            ],
            revealSensitive: false,
            type: "accessToken:read",
          },
        ],
      },
    },
  });
  if (res.success) {
    const data = res.data;
    await updateProjectClient(
      {
        projectId: props.project.id,
        teamId: props.project.teamId,
      },
      {
        services: [
          ...props.project.services,
          {
            actions: [],
            managementAccessToken: data.accessToken,
            maskedAdminKey: maskSecret(props.adminKey),
            name: "engineCloud",
            rotationCode: props.rotationCode,
          },
        ],
      },
    );
    return res;
  }
  throw new Error(`Failed to create management access token: ${res.error}`);
}

export function maskSecret(secret: string) {
  return `${secret.substring(0, 11)}...${secret.substring(secret.length - 5)}`;
}
