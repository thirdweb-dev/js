"use client";
import type { Project } from "@/api/projects";
import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useMutation } from "@tanstack/react-query";
import { createEoa } from "@thirdweb-dev/vault-sdk";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { initVaultClient } from "../../lib/vault.client";

export default function CreateServerWallet(props: {
  project: Project;
  managementAccessToken: string | undefined;
}) {
  const router = useDashboardRouter();
  const createEoaMutation = useMutation({
    mutationFn: async ({
      managementAccessToken,
    }: {
      managementAccessToken: string;
    }) => {
      const vaultClient = await initVaultClient();

      const eoa = await createEoa({
        request: {
          options: {
            metadata: {
              projectId: props.project.id,
              teamId: props.project.teamId,
              type: "server-wallet",
            },
          },
          auth: {
            accessToken: managementAccessToken,
          },
        },
        client: vaultClient,
      });

      if (!eoa.success) {
        throw new Error("Failed to create eoa");
      }

      router.refresh();

      return eoa;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateServerWallet = async () => {
    if (!props.managementAccessToken) {
      router.push("vault");
    } else {
      await createEoaMutation.mutateAsync({
        managementAccessToken: props.managementAccessToken,
      });
    }
  };

  const isLoading = createEoaMutation.isPending;

  return (
    <>
      <Button
        variant={"primary"}
        onClick={handleCreateServerWallet}
        disabled={isLoading}
        className="flex flex-row items-center gap-2"
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {props.managementAccessToken ? "Create Server Wallet" : "Get Started"}
      </Button>
    </>
  );
}
