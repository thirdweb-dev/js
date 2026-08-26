"use client";

import { decrypt, encrypt } from "@thirdweb-dev/service-utils";
import {
  createAccessToken,
  createEoa,
  createServiceAccount,
  createVaultClient,
  type VaultClient,
} from "@thirdweb-dev/vault-sdk";
import { engineCloudProxy } from "@/actions/proxies";
import {
  createVaultServerWallet,
  setVaultProjectWallet,
} from "@/actions/vault";
import type { Project } from "@/api/project/projects";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import { updateProjectClient } from "@/hooks/useApi";
import { getProjectWalletLabel } from "@/lib/project-wallet";

const SERVER_WALLET_ACCESS_TOKEN_PURPOSE =
  "Access Token for All Server Wallets";

const SERVER_WALLET_MANAGEMENT_ACCESS_TOKEN_PURPOSE =
  "Management Token for Dashboard";

/**
 * Retry a function with exponential backoff.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  const { maxAttempts = 3, baseDelayMs = 1000 } = options;
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new Error("maxAttempts must be at least 1");
  }
  if (!Number.isFinite(baseDelayMs) || baseDelayMs < 0) {
    throw new Error("baseDelayMs must be a non-negative number");
  }
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxAttempts) {
        // Exponential backoff with cap at 30s and jitter to prevent thundering herd
        const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), 30_000);
        const jitter = Math.floor(Math.random() * Math.min(250, delay));
        await new Promise<void>((resolve) =>
          setTimeout(resolve, delay + jitter),
        );
      }
    }
  }

  throw lastError ?? new Error("withRetry failed without capturing an error");
}

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

export async function createProjectServerWallet(props: {
  project: Project;
  label?: string;
  setAsProjectWallet?: boolean;
}) {
  const { wallet } = await createVaultServerWallet({
    chainType: "evm",
    label: props.label?.trim() || undefined,
    project: { projectId: props.project.id, teamId: props.project.teamId },
    setAsProjectWallet: props.setAsProjectWallet,
  });

  return wallet;
}

export async function updateDefaultProjectWallet(props: {
  project: Project;
  projectWalletAddress: string;
}) {
  await setVaultProjectWallet({
    address: props.projectWalletAddress,
    project: { projectId: props.project.id, teamId: props.project.teamId },
  });
}

/**
 * Creates the project's first server wallet during vault setup. Runs before the
 * management token is stored on the project, so it uses the token it was handed.
 */
async function createDefaultServerWallet(props: {
  project: Project;
  managementAccessToken: string;
  vaultClient: VaultClient;
}) {
  const eoa = await createEoa({
    client: props.vaultClient,
    request: {
      auth: {
        accessToken: props.managementAccessToken,
      },
      options: {
        metadata: {
          label: getProjectWalletLabel(props.project.name),
          projectId: props.project.id,
          teamId: props.project.teamId,
          type: "server-wallet",
        },
      },
    },
  });

  if (!eoa.success) {
    throw new Error(eoa.error?.message || "Failed to create server wallet");
  }

  engineCloudProxy({
    body: JSON.stringify({
      signerAddress: eoa.data.address,
    }),
    headers: {
      "Content-Type": "application/json",
      "x-client-id": props.project.publishableKey,
      "x-team-id": props.project.teamId,
    },
    method: "POST",
    pathname: "/cache/smart-account",
  }).catch((err) => {
    console.warn("failed to cache server wallet", err);
  });

  return eoa.data;
}

async function createAndEncryptVaultAccessTokens(props: {
  project: Project;
  vaultClient: VaultClient;
  projectSecretKey?: string;
  projectSecretHash?: string;
  adminKey: string;
  rotationCode: string;
}) {
  const {
    project,
    projectSecretKey,
    projectSecretHash,
    vaultClient,
    adminKey,
    rotationCode,
  } = props;

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

  // CRITICAL: Save credentials IMMEDIATELY after creating tokens.
  // This prevents a broken state if wallet creation or other operations fail.
  // The rotationCode is consumed when rotating, so if we don't save the new one,
  // the project becomes unrecoverable.
  let encryptedAdminKey: string | null = null;
  let encryptedWalletAccessToken: string | null = null;

  if (projectSecretKey) {
    // verify that the project secret key is valid
    const projectSecretKeyHash = await hashSecretKey(projectSecretKey);
    const secretKeysHashed = [
      ...project.secretKeys,
      // for newly rotated secret keys, we don't have the secret key in the project secret keys yet
      ...(projectSecretHash ? [{ hash: projectSecretHash }] : []),
    ];
    if (!secretKeysHashed.some((key) => key?.hash === projectSecretKeyHash)) {
      throw new Error("Invalid project secret key");
    }

    // encrypt admin key and wallet token with project secret key
    [encryptedAdminKey, encryptedWalletAccessToken] = await Promise.all([
      encrypt(adminKey, projectSecretKey),
      encrypt(walletToken.accessToken, projectSecretKey),
    ]);
  }

  let projectWalletAddress: string | null | undefined = project.services.find(
    (s) => s.name === "engineCloud",
  )?.projectWalletAddress;

  if (!projectWalletAddress) {
    const defaultProjectServerWallet = await createDefaultServerWallet({
      project,
      managementAccessToken: managementToken.accessToken,
      vaultClient,
    });
    projectWalletAddress = defaultProjectServerWallet.address;
  }

  // Save credentials with retry - this is critical because if rotation succeeded
  // but this save fails, the new rotation code is lost and project becomes unrecoverable
  await withRetry(
    () =>
      updateProjectClient(
        {
          projectId: project.id,
          teamId: project.teamId,
        },
        {
          services: [
            ...project.services.filter(
              (service) => service.name !== "engineCloud",
            ),
            {
              name: "engineCloud",
              actions: [],
              managementAccessToken: managementToken.accessToken,
              maskedAdminKey: maskSecret(adminKey),
              encryptedAdminKey,
              encryptedWalletAccessToken,
              rotationCode: rotationCode,
              projectWalletAddress: projectWalletAddress ?? null,
            },
          ],
        },
      ),
    { maxAttempts: 3, baseDelayMs: 1000 },
  );

  return {
    managementToken,
    walletToken,
  };
}

async function createWalletAccessToken(props: {
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
            type: "eoa:signAuthorization",
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
            type: "solana:read",
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
            type: "solana:create",
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
            type: "solana:signTransaction",
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
            type: "solana:signMessage",
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
              {
                key: "type",
                rule: {
                  pattern: "server-wallet",
                },
              },
            ],
            type: "solana:read",
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
            type: "solana:create",
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

/**
 * Upgrades existing access tokens to include Solana permissions
 * This is needed when a project was created before Solana support was added
 *
 * Returns an object with success/error instead of throwing for Next.js server actions
 */
export async function upgradeAccessTokensForSolana(props: {
  project: Project;
  projectSecretKey?: string;
}): Promise<{
  success: boolean;
  error?: string;
  data?: {
    managementToken: string;
    walletToken?: string;
  };
}> {
  const { project, projectSecretKey } = props;

  try {
    // Find the engineCloud service
    const engineCloudService = project.services.find(
      (service) => service.name === "engineCloud",
    );

    if (!engineCloudService) {
      return {
        success: false,
        error: "No engineCloud service found on project",
      };
    }

    const vaultClient = await initVaultClient();
    const hasEncryptedAdminKey = !!engineCloudService.encryptedAdminKey;

    // Check if this is an ejected vault (no encrypted admin key stored)
    if (!hasEncryptedAdminKey) {
      // For ejected vaults, we only need to update the management token
      // User manages their own admin key, so we can't create wallet tokens

      // We need the admin key from the user
      if (!projectSecretKey) {
        return {
          success: false,
          error: "Admin key required. Please enter your vault admin key.",
        };
      }

      // For ejected vault, the "secret key" parameter is actually the admin key
      const managementTokenResult = await createManagementAccessToken({
        project,
        adminKey: projectSecretKey,
        vaultClient,
      });

      if (!managementTokenResult.success) {
        return {
          success: false,
          error: `Failed to create management token: ${managementTokenResult.error}`,
        };
      }

      // Update only the management token for ejected vaults
      // Keep everything else the same (no encrypted keys to update)
      await updateProjectClient(
        {
          projectId: project.id,
          teamId: project.teamId,
        },
        {
          services: [
            ...project.services.filter(
              (service) => service.name !== "engineCloud",
            ),
            {
              ...engineCloudService,
              managementAccessToken: managementTokenResult.data.accessToken,
            },
          ],
        },
      );

      return {
        success: true,
        data: {
          managementToken: managementTokenResult.data.accessToken,
        },
      };
    }

    // For non-ejected vaults (with encrypted admin key)
    if (!projectSecretKey) {
      return {
        success: false,
        error: "Project secret key is required to upgrade tokens",
      };
    }

    // Verify the project secret key
    const projectSecretKeyHash = await hashSecretKey(projectSecretKey);
    if (!project.secretKeys.some((key) => key?.hash === projectSecretKeyHash)) {
      return {
        success: false,
        error: "Invalid project secret key",
      };
    }

    // Decrypt the admin key (we know it exists from the hasEncryptedAdminKey check)
    const adminKey = await decrypt(
      engineCloudService.encryptedAdminKey as string,
      projectSecretKey,
    );

    // Create new tokens with Solana permissions
    const [managementTokenResult, walletTokenResult] = await Promise.all([
      createManagementAccessToken({ project, adminKey, vaultClient }),
      createWalletAccessToken({ project, adminKey, vaultClient }),
    ]);

    if (!managementTokenResult.success) {
      return {
        success: false,
        error: `Failed to create management token: ${managementTokenResult.error}`,
      };
    }

    if (!walletTokenResult.success) {
      return {
        success: false,
        error: `Failed to create wallet token: ${walletTokenResult.error}`,
      };
    }

    const managementToken = managementTokenResult.data;
    const walletToken = walletTokenResult.data;

    // Encrypt the new wallet token
    const [encryptedAdminKey, encryptedWalletAccessToken] = await Promise.all([
      encrypt(adminKey, projectSecretKey),
      encrypt(walletToken.accessToken, projectSecretKey),
    ]);

    // Update the project with new tokens
    await updateProjectClient(
      {
        projectId: project.id,
        teamId: project.teamId,
      },
      {
        services: [
          ...project.services.filter(
            (service) => service.name !== "engineCloud",
          ),
          {
            ...engineCloudService,
            managementAccessToken: managementToken.accessToken,
            encryptedAdminKey,
            encryptedWalletAccessToken,
          },
        ],
      },
    );

    return {
      success: true,
      data: {
        managementToken: managementToken.accessToken,
        walletToken: walletToken.accessToken,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upgrade access tokens",
    };
  }
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
