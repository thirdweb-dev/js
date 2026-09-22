import "server-only";

import { listVaultServerWallets } from "@/actions/vault";
import type { Project } from "@/api/project/projects";
import { getProjectWalletLabel } from "@/lib/project-wallet";

export type ProjectWalletSummary = {
  id: string;
  address: string;
  label?: string;
};

export async function getProjectWallet(
  project: Project,
): Promise<ProjectWalletSummary | undefined> {
  const engineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const managementAccessToken =
    engineCloudService?.managementAccessToken || undefined;
  const projectWalletAddress = (
    engineCloudService as { projectWalletAddress?: string } | undefined
  )?.projectWalletAddress;

  if (!managementAccessToken || !projectWalletAddress) {
    return undefined;
  }

  try {
    const { wallets } = await listVaultServerWallets({
      chainType: "evm",
      pageSize: 100,
      project: { projectId: project.id, teamId: project.teamId },
    });

    const defaultWallet = wallets.find(
      (wallet) =>
        wallet.address.toLowerCase() === projectWalletAddress.toLowerCase(),
    );

    if (!defaultWallet) {
      return undefined;
    }

    return {
      address: defaultWallet.address,
      id: defaultWallet.address,
      label: defaultWallet.label ?? getProjectWalletLabel(project.name),
    };
  } catch (error) {
    console.error("Failed to load project wallet", error);
    return undefined;
  }
}
