"use client";
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
import { useMutation } from "@tanstack/react-query";
import { createEoa } from "@thirdweb-dev/vault-sdk";
import { Loader2, WalletIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { engineCloudProxy } from "../../../../../../../../../@/actions/proxies";
import { useTrack } from "../../../../../../../../../hooks/analytics/useTrack";
import { initVaultClient } from "../../lib/vault.client";

export default function CreateServerWallet(props: {
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
}) {
  const router = useDashboardRouter();
  const [label, setLabel] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const trackEvent = useTrack();

  const createEoaMutation = useMutation({
    mutationFn: async ({
      managementAccessToken,
      label,
    }: {
      managementAccessToken: string;
      label: string;
    }) => {
      trackEvent({
        category: "engine-cloud",
        action: "create_server_wallet",
      });

      const vaultClient = await initVaultClient();

      const eoa = await createEoa({
        request: {
          options: {
            metadata: {
              projectId: props.project.id,
              teamId: props.project.teamId,
              type: "server-wallet",
              label,
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

      // no need to await this, it's not blocking
      engineCloudProxy({
        pathname: "/cache/smart-account",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-team-id": props.project.teamId,
          "x-client-id": props.project.publishableKey,
        },
        body: JSON.stringify({
          signerAddress: eoa.data.address,
        }),
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
      router.push(
        `/team/${props.teamSlug}/${props.project.slug}/engine/cloud/vault`,
      );
    } else {
      await createEoaMutation.mutateAsync({
        managementAccessToken: props.managementAccessToken,
        label,
      });
    }
  };

  const isLoading = createEoaMutation.isPending;

  return (
    <>
      <Button
        variant={"primary"}
        onClick={() =>
          props.managementAccessToken
            ? setModalOpen(true)
            : router.push(
                `/team/${props.teamSlug}/${props.project.slug}/engine/cloud/vault`,
              )
        }
        className="flex flex-row items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <WalletIcon className="size-4" />
        )}
        {props.managementAccessToken
          ? isLoading
            ? "Creating..."
            : "Create Server Wallet"
          : "Get Started"}
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
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
                placeholder="Wallet label (optional)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateServerWallet}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
