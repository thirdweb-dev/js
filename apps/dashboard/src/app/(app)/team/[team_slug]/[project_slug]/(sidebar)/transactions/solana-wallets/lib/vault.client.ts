"use server";

import type { Project } from "@/api/project/projects";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import type { SolanaWallet } from "../wallet-table/types";

interface SolanaAccountResponse {
  publicKey: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface ListSolanaAccountsResponse {
  result: {
    accounts: SolanaAccountResponse[];
    pagination: {
      totalCount: number;
      page: number;
      limit: number;
    };
  };
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

  try {
    const url = new URL(`/v1/solana/accounts`, NEXT_PUBLIC_THIRDWEB_VAULT_URL);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-vault-access-token": managementAccessToken,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Solana accounts: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as ListSolanaAccountsResponse;

    // Transform the response to match SolanaWallet type
    const wallets: SolanaWallet[] = data.result.accounts.map(
      (account, index) => ({
        id: `${account.publicKey}-${index}`, // Generate ID from publicKey
        publicKey: account.publicKey,
        metadata: {
          type: "solana-wallet",
          projectId: projectId || "",
          label: account.label,
        },
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      }),
    );

    return {
      data: {
        items: wallets,
        totalRecords: data.result.pagination.totalCount,
      },
      error: null,
      success: true,
    };
  } catch (error) {
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
}): Promise<{
  data: SolanaAccountResponse | null;
  error: Error | null;
  success: boolean;
}> {
  const { managementAccessToken, label } = params;

  try {
    const url = new URL(`/v1/solana/accounts`, NEXT_PUBLIC_THIRDWEB_VAULT_URL);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vault-access-token": managementAccessToken,
      },
      body: JSON.stringify({ label }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create Solana account: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as { result: SolanaAccountResponse };

    return {
      data: data.result,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
      success: false,
    };
  }
}

export async function updateDefaultProjectSolanaWallet(params: {
  project: Project;
  publicKey: string;
}): Promise<void> {
  // This would be implemented similar to the EVM version
  // For now, this is a placeholder
  console.log("Update default Solana wallet", params);
}
