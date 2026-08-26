"use server";

import {
  createVaultServerWallet,
  listVaultServerWallets,
} from "@/actions/vault";
import type { SolanaWallet } from "../wallet-table/types";

interface SolanaAccountResponse {
  pubkey: string;
  createdAt: string;
  updatedAt: string;
}

export type SolanaWalletList = {
  data: { items: SolanaWallet[]; totalRecords: number };
  error: Error | null;
  success: boolean;
};

export async function listSolanaAccounts(params: {
  teamId: string;
  projectId: string;
  page?: number;
  limit?: number;
}): Promise<SolanaWalletList> {
  const { teamId, projectId, page = 1, limit = 100 } = params;

  try {
    const result = await listVaultServerWallets({
      chainType: "solana",
      page,
      pageSize: limit,
      project: { projectId, teamId },
    });

    return {
      data: {
        items: result.wallets.map<SolanaWallet>((wallet) => ({
          createdAt: wallet.createdAt,
          id: wallet.address,
          metadata: {
            label: wallet.label ?? undefined,
            projectId,
            type: "server-wallet",
          },
          publicKey: wallet.address,
          updatedAt: wallet.updatedAt,
        })),
        totalRecords: result.totalRecords,
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
  teamId: string;
  projectId: string;
  label: string;
}): Promise<{
  data: SolanaAccountResponse | null;
  error: Error | null;
  success: boolean;
}> {
  const { teamId, projectId, label } = params;

  try {
    const { wallet } = await createVaultServerWallet({
      chainType: "solana",
      label,
      project: { projectId, teamId },
    });

    return {
      data: {
        createdAt: wallet.createdAt,
        pubkey: wallet.address,
        updatedAt: wallet.updatedAt,
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
