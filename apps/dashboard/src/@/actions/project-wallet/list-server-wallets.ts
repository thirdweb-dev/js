"use server";

import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import type { ProjectWalletSummary } from "@/lib/server/project-wallet";

interface VaultWalletListItem {
  id: string;
  address: string;
  metadata?: {
    label?: string;
    projectId?: string;
    teamId?: string;
    type?: string;
  } | null;
}

export async function listProjectServerWallets(params: {
  managementAccessToken: string;
  projectId: string;
  pageSize?: number;
}): Promise<ProjectWalletSummary[]> {
  const { managementAccessToken, projectId, pageSize = 100 } = params;

  if (!managementAccessToken || !NEXT_PUBLIC_THIRDWEB_VAULT_URL) {
    return [];
  }

  try {
    const vaultClient = await createVaultClient({
      baseUrl: NEXT_PUBLIC_THIRDWEB_VAULT_URL,
    });

    const response = await listEoas({
      client: vaultClient,
      request: {
        auth: {
          accessToken: managementAccessToken,
        },
        options: {
          page: 0,
          // @ts-expect-error - Vault SDK expects snake_case pagination fields
          page_size: pageSize,
        },
      },
    });

    if (!response.success || !response.data?.items) {
      return [];
    }

    const items = response.data.items as VaultWalletListItem[];

    return items
      .filter((item) => {
        return (
          item.metadata?.projectId === projectId &&
          (!item.metadata?.type || item.metadata.type === "server-wallet")
        );
      })
      .map<ProjectWalletSummary>((item) => ({
        id: item.id,
        address: item.address,
        label: item.metadata?.label ?? undefined,
      }));
  } catch (error) {
    console.error("Failed to list project server wallets", error);
    return [];
  }
}
