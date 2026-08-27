"use client";

import {
  createVaultServerWallet,
  setVaultProjectWallet,
} from "@/actions/vault";
import type { Project } from "@/api/project/projects";

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

export function maskSecret(secret: string) {
  return `${secret.substring(0, 11)}...${secret.substring(secret.length - 5)}`;
}
