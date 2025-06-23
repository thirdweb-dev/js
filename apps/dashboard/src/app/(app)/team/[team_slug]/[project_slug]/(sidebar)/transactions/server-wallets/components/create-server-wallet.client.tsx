"use client";
import { useMutation } from "@tanstack/react-query";
import { createEoa } from "@thirdweb-dev/vault-sdk";
import { Loader2Icon, WalletIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { initVaultClient } from "../../lib/vault.client";

export default function CreateServerWallet(props: {
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
}) {
  const router = useDashboardRouter();
  const [label, setLabel] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const createEoaMutation = useMutation({
    mutationFn: async ({
      managementAccessToken,
      label,
    }: {
      managementAccessToken: string;
      label: string;
    }) => {
      const vaultClient = await initVaultClient();

      const eoa = await createEoa({
        client: vaultClient,
        request: {
          auth: {
            accessToken: managementAccessToken,
          },
          options: {
            metadata: {
              label,
              projectId: props.project.id,
              teamId: props.project.teamId,
              type: "server-wallet",
            },
          },
        },
      });

      if (!eoa.success) {
        throw new Error("Failed to create eoa");
      }

      // no need to await this, it's not blocking
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

      router.refresh();
      setModalOpen(false);

      return eoa;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateServerWallet = async () => {
    if (!props.managementAccessToken) {
      router.push(`/team/${props.teamSlug}/${props.project.slug}/vault`);
    } else {
      await createEoaMutation.mutateAsync({
        label,
        managementAccessToken: props.managementAccessToken,
      });
    }
  };

  const isLoading = createEoaMutation.isPending;

  return (
    <>
      <Button
        className="flex flex-row items-center gap-2"
        onClick={() =>
          props.managementAccessToken
            ? setModalOpen(true)
            : router.push(`/team/${props.teamSlug}/${props.project.slug}/vault`)
        }
        variant={"primary"}
      >
        {isLoading ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <WalletIcon className="size-4" />
        )}
        {props.managementAccessToken
          ? isLoading
            ? "Creating..."
            : "Create Server Wallet"
          : "Get Started"}
      </Button>

      <Dialog onOpenChange={setModalOpen} open={modalOpen}>
        <DialogContent className="p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Create server wallet</DialogTitle>
            <DialogDescription>
              Enter a label for your server wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 px-6">
            <div>
              <Input
                className="w-full"
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Wallet label (optional)"
                value={label}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
            <Button
              disabled={isLoading}
              onClick={() => setModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleCreateServerWallet}
              variant="primary"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
