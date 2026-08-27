"use server";

import { apiServerProxy } from "@/actions/proxies";

type VaultChainType = "evm" | "solana";

type VaultServerWallet = {
  address: string;
  label: string | null;
  chainType: VaultChainType;
  createdAt: string;
  updatedAt: string;
};

type VaultServerWalletPage = {
  wallets: VaultServerWallet[];
  page: number;
  pageSize: number;
  totalRecords: number;
  projectWalletAddress: string | null;
};

type VaultAccessToken = {
  id: string;
  accessToken: string | null;
  maskedAccessToken: string;
  purpose: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
};

type VaultAccessTokenPage = {
  accessTokens: VaultAccessToken[];
  page: number;
  pageSize: number;
  totalRecords: number;
  revealed: boolean;
};

type RotateVaultServiceAccountResult = {
  isManagedVault: boolean;
  maskedAdminKey: string;
  adminKey?: string;
  walletAccessToken?: string;
};

type CreateVaultServiceAccountResult = RotateVaultServiceAccountResult & {
  /** The project's default server wallet, null when none was created. */
  projectWalletAddress: string | null;
};

/**
 * Credentials the caller supplies to unlock a vault. A managed vault takes the
 * project secret key, an ejected one takes the vault admin key.
 */
export type VaultCredentials = {
  projectSecretKey?: string;
  adminKey?: string;
};

type ProjectRef = {
  teamId: string;
  projectId: string;
};

function vaultPath(project: ProjectRef, path: string) {
  return `/v1/teams/${project.teamId}/projects/${project.projectId}/vault${path}`;
}

/** API server errors are `{ data: null, error: { message, code, ... } }`. */
function errorMessage(body: string, fallback: string) {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string } };
    if (parsed.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // not JSON, fall through
  }
  return body || fallback;
}

export async function listVaultServerWallets(params: {
  project: ProjectRef;
  chainType: VaultChainType;
  page?: number;
  pageSize?: number;
}): Promise<VaultServerWalletPage> {
  const res = await apiServerProxy<{ data: VaultServerWalletPage }>({
    method: "GET",
    pathname: vaultPath(params.project, "/wallets"),
    searchParams: {
      chainType: params.chainType,
      page: params.page?.toString(),
      pageSize: params.pageSize?.toString(),
    },
  });

  if (!res.ok) {
    throw new Error(errorMessage(res.error, "Failed to list server wallets"));
  }

  return res.data.data;
}

export async function createVaultServerWallet(params: {
  project: ProjectRef;
  chainType: VaultChainType;
  label?: string;
  setAsProjectWallet?: boolean;
}): Promise<{
  wallet: VaultServerWallet;
  smartAccountCached: boolean;
  projectWalletAddress: string | null;
}> {
  const res = await apiServerProxy<{
    data: {
      wallet: VaultServerWallet;
      smartAccountCached: boolean;
      projectWalletAddress: string | null;
    };
  }>({
    body: JSON.stringify({
      chainType: params.chainType,
      label: params.label,
      setAsProjectWallet: params.setAsProjectWallet,
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
    pathname: vaultPath(params.project, "/wallets"),
  });

  if (!res.ok) {
    throw new Error(errorMessage(res.error, "Failed to create server wallet"));
  }

  return res.data.data;
}

export async function setVaultProjectWallet(params: {
  project: ProjectRef;
  address: string;
}): Promise<{ projectWalletAddress: string }> {
  const res = await apiServerProxy<{
    data: { projectWalletAddress: string };
  }>({
    body: JSON.stringify({ address: params.address }),
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
    pathname: vaultPath(params.project, "/project-wallet"),
  });

  if (!res.ok) {
    throw new Error(errorMessage(res.error, "Failed to update project wallet"));
  }

  return res.data.data;
}

/**
 * Creates the project's vault service account and its access tokens.
 *
 * A managed vault seals its admin key and wallet token with the project secret
 * key and returns neither. An ejected vault returns both, once.
 */
export async function createVaultServiceAccount(params: {
  project: ProjectRef;
  mode: "managed" | "ejected";
  projectSecretKey?: string;
  skipWalletCreation?: boolean;
}): Promise<CreateVaultServiceAccountResult> {
  const res = await apiServerProxy<{
    data: CreateVaultServiceAccountResult;
  }>({
    body: JSON.stringify({
      mode: params.mode,
      projectSecretKey: params.projectSecretKey,
      skipWalletCreation: params.skipWalletCreation,
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
    pathname: vaultPath(params.project, "/service-account"),
  });

  if (!res.ok) {
    throw new Error(errorMessage(res.error, "Failed to create vault"));
  }

  return res.data.data;
}

/**
 * Rotates the project's vault admin key.
 *
 * `mode` is the state to leave the vault in. `managed` re-seals the new
 * credentials with the project secret key and returns only the mask; `ejected`
 * returns the admin key and wallet token once and keeps no copy. Omitting it
 * keeps the vault as it is.
 */
export async function rotateVaultServiceAccount(params: {
  project: ProjectRef;
  mode?: "managed" | "ejected";
  projectSecretKey?: string;
}): Promise<RotateVaultServiceAccountResult> {
  const res = await apiServerProxy<{
    data: RotateVaultServiceAccountResult;
  }>({
    body: JSON.stringify({
      mode: params.mode,
      projectSecretKey: params.projectSecretKey,
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
    pathname: vaultPath(params.project, "/service-account/rotate"),
  });

  if (!res.ok) {
    throw new Error(errorMessage(res.error, "Failed to rotate admin key"));
  }

  return res.data.data;
}

export async function listVaultAccessTokens(params: {
  project: ProjectRef;
  credentials?: VaultCredentials;
  page?: number;
  pageSize?: number;
}): Promise<VaultAccessTokenPage> {
  const { credentials } = params;

  const res = await apiServerProxy<{ data: VaultAccessTokenPage }>({
    headers: {
      ...(credentials?.projectSecretKey
        ? { "x-vault-project-secret-key": credentials.projectSecretKey }
        : {}),
      ...(credentials?.adminKey
        ? { "x-vault-admin-key": credentials.adminKey }
        : {}),
    },
    method: "GET",
    pathname: vaultPath(params.project, "/access-tokens"),
    searchParams: {
      page: params.page?.toString(),
      pageSize: params.pageSize?.toString(),
    },
  });

  if (!res.ok) {
    throw new Error(errorMessage(res.error, "Failed to list access tokens"));
  }

  return res.data.data;
}

export async function createVaultAccessToken(params: {
  project: ProjectRef;
  credentials: VaultCredentials;
  label?: string;
}): Promise<{ id: string; accessToken: string; purpose: string }> {
  const res = await apiServerProxy<{
    data: { id: string; accessToken: string; purpose: string };
  }>({
    body: JSON.stringify({
      adminKey: params.credentials.adminKey,
      label: params.label,
      projectSecretKey: params.credentials.projectSecretKey,
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
    pathname: vaultPath(params.project, "/access-tokens"),
  });

  if (!res.ok) {
    throw new Error(errorMessage(res.error, "Failed to create access token"));
  }

  return res.data.data;
}

export async function revokeVaultAccessToken(params: {
  project: ProjectRef;
  credentials: VaultCredentials;
  accessTokenId: string;
}): Promise<{ id: string }> {
  const res = await apiServerProxy<{ data: { id: string } }>({
    body: JSON.stringify({
      adminKey: params.credentials.adminKey,
      projectSecretKey: params.credentials.projectSecretKey,
    }),
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
    pathname: vaultPath(
      params.project,
      `/access-tokens/${encodeURIComponent(params.accessTokenId)}`,
    ),
  });

  if (!res.ok) {
    throw new Error(errorMessage(res.error, "Failed to revoke access token"));
  }

  return res.data.data;
}
