import "server-only";

import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import type { Project } from "@/api/project/projects";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import { getProjectWalletLabel } from "@/lib/project-wallet";

export type ProjectWalletSummary = {
  id: string;
  address: string;
  label?: string;
};

type VaultWalletListItem = {
  id: string;
  address: string;
  metadata?: {
    label?: string;
    projectId?: string;
    teamId?: string;
    type?: string;
  };
};

export async function getProjectWallet(
  project: Project,
): Promise<ProjectWalletSummary | undefined> {
  const engineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const managementAccessToken =
    engineCloudService?.managementAccessToken || undefined;

  if (!managementAccessToken || !NEXT_PUBLIC_THIRDWEB_VAULT_URL) {
    return undefined;
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
          // @ts-expect-error - SDK expects snake_case for pagination arguments
          page_size: 25,
        },
      },
    });

    if (!response.success || !response.data) {
      return undefined;
    }

    const items = response.data.items as VaultWalletListItem[] | undefined;

    if (!items?.length) {
      return undefined;
    }

    const expectedLabel = getProjectWalletLabel(project.name);

    const serverWallets = items.filter(
      (item) => item.metadata?.projectId === project.id,
    );

    const defaultWallet =
      serverWallets.find((item) => item.metadata?.label === expectedLabel) ??
      serverWallets.find((item) => item.metadata?.type === "server-wallet") ??
      serverWallets[0];

    if (!defaultWallet) {
      return undefined;
    }

    return {
      id: defaultWallet.id,
      address: defaultWallet.address,
      label: defaultWallet.metadata?.label,
    };
  } catch (error) {
    console.error("Failed to load project wallet", error);
    return undefined;
  }
}
