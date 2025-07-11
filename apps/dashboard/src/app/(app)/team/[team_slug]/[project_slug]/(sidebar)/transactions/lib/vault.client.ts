"use client";

import { encrypt } from "@thirdweb-dev/service-utils";
import {
  createAccessToken,
  createServiceAccount,
  createVaultClient,
  rotateServiceAccount,
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

export async function rotateVaultAccountAndAccessToken(props: {
  project: Project;
  projectSecretKey?: string;
  projectSecretHash?: string;
}) {
  const vaultClient = await initVaultClient();
  const service = props.project.services.find(
    (service) => service.name === "engineCloud",
  );
  const storedRotationCode = service?.rotationCode;
  if (!storedRotationCode) {
    throw new Error("No rotation code found");
  }

  const rotateServiceAccountRes = await rotateServiceAccount({
    client: vaultClient,
    request: {
      auth: {
        rotationCode: storedRotationCode,
      },
    },
  });
  if (rotateServiceAccountRes.error) {
    throw new Error(rotateServiceAccountRes.error.message);
  }
  const adminKey = rotateServiceAccountRes.data.newAdminKey;
  const rotationCode = rotateServiceAccountRes.data.newRotationCode;

  const { managementToken, walletToken } =
    await createAndEncryptVaultAccessTokens({
      project: props.project,
      projectSecretKey: props.projectSecretKey,
      projectSecretHash: props.projectSecretHash,
      vaultClient,
      adminKey,
      rotationCode,
    });

  return {
    adminKey,
    managementToken,
    walletToken,
  };
}

export async function createVaultAccountAndAccessToken(props: {
  project: Project;
  projectSecretKey?: string;
  projectSecretHash?: string;
}) {
  try {
    const vaultClient = await initVaultClient();

    const serviceAccountResult = await createServiceAccount({
      client: vaultClient,
      request: {
        options: {
          metadata: {
            projectId: props.project.id,
            purpose: "Thirdweb Project Server Wallet Service Account",
            teamId: props.project.teamId,
          },
        },
      },
    });
    if (serviceAccountResult.success === false) {
      throw new Error(
        `Failed to create service account: ${serviceAccountResult.error}`,
      );
    }
    const serviceAccount = serviceAccountResult.data;
    const adminKey = serviceAccount.adminKey;
    const rotationCode = serviceAccount.rotationCode;

    const { managementToken, walletToken } =
      await createAndEncryptVaultAccessTokens({
        project: props.project,
        projectSecretKey: props.projectSecretKey,
        projectSecretHash: props.projectSecretHash,
        vaultClient,
        adminKey,
        rotationCode,
      });

    return {
      adminKey,
      managementToken,
      walletToken,
    };
  } catch (error) {
    throw new Error(
      `Failed to create vault account and access token: ${error}`,
    );
  }
}

async function createAndEncryptVaultAccessTokens(props: {
  project: Project;
  vaultClient: VaultClient;
  projectSecretKey?: string;
  projectSecretHash?: string;
  adminKey: string;
  rotationCode: string;
}) {
  const { project, projectSecretKey, vaultClient, adminKey, rotationCode } =
    props;

  const [managementTokenResult, walletTokenResult] = await Promise.all([
    createManagementAccessToken({ project, adminKey, vaultClient }),
    createWalletAccessToken({ project, adminKey, vaultClient }),
  ]);

  if (!managementTokenResult.success) {
    throw new Error(
      `Failed to create management token: ${managementTokenResult.error}`,
    );
  }

  if (!walletTokenResult.success) {
    throw new Error(
      `Failed to create wallet token: ${walletTokenResult.error}`,
    );
  }

  const managementToken = managementTokenResult.data;
  const walletToken = walletTokenResult.data;

  if (projectSecretKey) {
    // verify that the project secret key is valid
    const projectSecretKeyHash = await hashSecretKey(projectSecretKey);
    const secretKeysHashed = [
      ...project.secretKeys,
      // for newly rotated secret keys, we don't have the secret key in the project secret keys yet
      ...(props.projectSecretHash ? [{ hash: props.projectSecretHash }] : []),
    ];
    if (!secretKeysHashed.some((key) => key?.hash === projectSecretKeyHash)) {
      throw new Error("Invalid project secret key");
    }

    // encrypt admin key and wallet token with project secret key
    const [encryptedAdminKey, encryptedWalletAccessToken] = await Promise.all([
      encrypt(adminKey, projectSecretKey),
      encrypt(walletToken.accessToken, projectSecretKey),
    ]);

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
            actions: [],
            managementAccessToken: managementToken.accessToken,
            maskedAdminKey: maskSecret(adminKey),
            encryptedAdminKey,
            encryptedWalletAccessToken,
            rotationCode: rotationCode,
          },
        ],
      },
    );
  } else {
    // no secret key, only store the management token, remove any encrypted keys
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
            actions: [],
            managementAccessToken: managementToken.accessToken,
            maskedAdminKey: maskSecret(adminKey),
            encryptedAdminKey: null,
            encryptedWalletAccessToken: null,
            rotationCode: rotationCode,
          },
        ],
      },
    );
  }

  return {
    managementToken,
    walletToken,
  };
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

async function createManagementAccessToken(props: {
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
}

export function maskSecret(secret: string) {
  return `${secret.substring(0, 11)}...${secret.substring(secret.length - 5)}`;
}

async function hashSecretKey(secretKey: string) {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error(
      "This function can only be used in the browser environment with Web Crypto API support.",
    );
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(secretKey);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
}

function bufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
