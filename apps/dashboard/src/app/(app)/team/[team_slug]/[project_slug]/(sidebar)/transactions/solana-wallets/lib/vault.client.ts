"use server";

import {
  createVaultClient,
  createSolanaAccount as vaultCreateSolanaAccount,
  listSolanaAccounts as vaultListSolanaAccounts,
} from "@thirdweb-dev/vault-sdk";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import type { SolanaWallet } from "../wallet-table/types";

interface VaultSolanaAccountListItem {
  id: string;
  pubkey: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    projectId?: string;
    type?: string;
    label?: string;
  } | null;
}

interface SolanaAccountResponse {
  pubkey: string;
  createdAt: string;
  updatedAt: string;
}

export async function listSolanaAccounts(params: {
  managementAccessToken: string;
  page?: number;
  limit?: number;
  projectId?: string;
}): Promise<{
  data: {
    items: SolanaWallet[];
    totalRecords: number;
  };
  error: Error | null;
  success: boolean;
}> {
  const { managementAccessToken, page = 1, limit = 100, projectId } = params;

  if (!managementAccessToken || !NEXT_PUBLIC_THIRDWEB_VAULT_URL) {
    return {
      data: {
        items: [],
        totalRecords: 0,
      },
      error: new Error("Missing managementAccessToken or vault URL"),
      success: false,
    };
  }

  try {
    const vaultClient = await createVaultClient({
      baseUrl: NEXT_PUBLIC_THIRDWEB_VAULT_URL,
    });

    const response = await vaultListSolanaAccounts({
      client: vaultClient,
      request: {
        auth: {
          accessToken: managementAccessToken,
        },
        options: {
          page: page - 1, // Vault SDK uses 0-based pagination
          pageSize: limit,
        },
      },
    });

    if (!response.success || !response.data) {
      return {
        data: {
          items: [],
          totalRecords: 0,
        },
        error: response.error
          ? new Error(JSON.stringify(response.error))
          : new Error("Failed to fetch Solana accounts"),
        success: false,
      };
    }

    const items = (response.data.items || []) as VaultSolanaAccountListItem[];

    // Filter by projectId and type, transform to SolanaWallet type
    const wallets: SolanaWallet[] = items
      .filter((item) => {
        // Filter by projectId
        if (projectId && item.metadata?.projectId !== projectId) {
          return false;
        }
        // Only include server-wallet type
        return !item.metadata?.type || item.metadata.type === "server-wallet";
      })
      .map((item) => ({
        id: item.id,
        publicKey: item.pubkey,
        metadata: {
          type: "server-wallet",
          projectId: item.metadata?.projectId || projectId || "",
          label: item.metadata?.label,
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

    return {
      data: {
        items: wallets,
        totalRecords: wallets.length, // Use filtered count since we're filtering by projectId
      },
      error: null,
      success: true,
    };
  } catch (error) {
    console.error("Failed to list Solana accounts", error);
    return {
      data: {
        items: [],
        totalRecords: 0,
      },
      error: error instanceof Error ? error : new Error("Unknown error"),
      success: false,
    };
  }
}

export async function createSolanaAccount(params: {
  managementAccessToken: string;
  label: string;
  projectId: string;
  teamId: string;
}): Promise<{
  data: SolanaAccountResponse | null;
  error: Error | null;
  success: boolean;
}> {
  const { managementAccessToken, label, projectId, teamId } = params;

  if (!managementAccessToken || !NEXT_PUBLIC_THIRDWEB_VAULT_URL) {
    return {
      data: null,
      error: new Error("Missing managementAccessToken or vault URL"),
      success: false,
    };
  }

  try {
    const vaultClient = await createVaultClient({
      baseUrl: NEXT_PUBLIC_THIRDWEB_VAULT_URL,
    });

    const response = await vaultCreateSolanaAccount({
      client: vaultClient,
      request: {
        auth: {
          accessToken: managementAccessToken,
        },
        options: {
          metadata: {
            label,
            projectId,
            teamId,
            type: "server-wallet",
          },
        },
      },
    });

    if (!response.success || !response.data) {
      return {
        data: null,
        error: response.error
          ? new Error(JSON.stringify(response.error))
          : new Error("Failed to create Solana account"),
        success: false,
      };
    }

    return {
      data: {
        pubkey: response.data.pubkey,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
      },
      error: null,
      success: true,
    };
  } catch (error) {
    console.error("Failed to create Solana account", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
      success: false,
    };
  }
}
