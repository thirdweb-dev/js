"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleAlertIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { listProjectServerWallets } from "@/actions/project-wallet/list-server-wallets";
import type { Project } from "@/api/project/projects";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ProjectWalletSummary } from "@/lib/server/project-wallet";
import { updateDefaultProjectWallet } from "../../transactions/lib/vault.client";
import CreateServerWallet from "../../transactions/server-wallets/components/create-server-wallet.client";

export function ProjectWalletSetup(props: {
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
}) {
  const { project, teamSlug, managementAccessToken } = props;
  const router = useDashboardRouter();
  const queryClient = useQueryClient();
  const client = useMemo(() => getClientThirdwebClient(), []);
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>(
    undefined,
  );

  const serverWalletsQuery = useQuery({
    enabled: Boolean(managementAccessToken),
    queryFn: async () => {
      if (!managementAccessToken) {
        return [] as ProjectWalletSummary[];
      }

      return listProjectServerWallets({
        managementAccessToken,
        projectId: project.id,
      });
    },
    queryKey: ["project", project.id, "server-wallets", managementAccessToken],
    staleTime: 60_000,
  });

  const serverWallets = serverWalletsQuery.data ?? [];

  const effectiveSelectedWalletId = useMemo(() => {
    if (
      selectedWalletId &&
      serverWallets.some((wallet) => wallet.id === selectedWalletId)
    ) {
      return selectedWalletId;
    }

    return serverWallets[0]?.id;
  }, [selectedWalletId, serverWallets]);

  const selectedWallet = useMemo(() => {
    if (!effectiveSelectedWalletId) {
      return undefined;
    }

    return serverWallets.find(
      (wallet) => wallet.id === effectiveSelectedWalletId,
    );
  }, [effectiveSelectedWalletId, serverWallets]);

  const setDefaultWalletMutation = useMutation({
    mutationFn: async (wallet: ProjectWalletSummary) => {
      await updateDefaultProjectWallet({
        project,
        projectWalletAddress: wallet.address,
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update project wallet";
      toast.error(message);
    },
    onSuccess: async (_, wallet) => {
      const descriptionLabel = wallet.label ?? wallet.address;
      toast.success("Project wallet updated", {
        description: `Now pointing to ${descriptionLabel}`,
      });
      await queryClient.invalidateQueries({
        queryKey: [
          "project",
          project.id,
          "server-wallets",
          managementAccessToken,
        ],
      });
      router.refresh();
    },
  });

  const canSelectExisting =
    Boolean(managementAccessToken) && serverWallets.length > 0;

  return (
    <Alert variant="info">
      <CircleAlertIcon className="size-5" />
      <AlertTitle>No project wallet set</AlertTitle>
      <AlertDescription>
        Set a project wallet to use for dashboard and API integrations.
      </AlertDescription>

      <div className="mt-4 space-y-5">
        {serverWalletsQuery.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-4" />
            <span>Loading existing server wallets…</span>
          </div>
        ) : canSelectExisting ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Choose an existing server wallet
              </p>
              <p className="text-sm text-muted-foreground">
                These wallets were already created for this project. Pick one to
                set as the default.
              </p>
              <Select
                onValueChange={(value) => setSelectedWalletId(value)}
                value={effectiveSelectedWalletId ?? ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select server wallet">
                    {selectedWallet ? (
                      <div className="flex items-center gap-2">
                        <WalletAddress
                          address={selectedWallet.address}
                          client={client}
                        />
                        <span className="text-muted-foreground text-sm">
                          {selectedWallet.label ?? "Unnamed server wallet"}
                        </span>
                      </div>
                    ) : (
                      "Select server wallet"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {serverWallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex items-center gap-2">
                        <WalletAddress
                          address={wallet.address}
                          client={client}
                        />
                        <span className="text-muted-foreground text-sm">
                          {wallet.label ?? "Unnamed server wallet"}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                disabled={!selectedWallet || setDefaultWalletMutation.isPending}
                onClick={() => {
                  if (selectedWallet) {
                    setDefaultWalletMutation.mutate(selectedWallet);
                  }
                }}
                type="button"
              >
                {setDefaultWalletMutation.isPending && (
                  <Spinner className="mr-2 size-4" />
                )}
                Set as project wallet
              </Button>
              <CreateServerWallet
                managementAccessToken={managementAccessToken}
                project={project}
                teamSlug={teamSlug}
                setAsProjectWallet
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Create a server wallet to start using transactions and other
              project features.
            </p>
            <CreateServerWallet
              managementAccessToken={managementAccessToken}
              project={project}
              teamSlug={teamSlug}
              setAsProjectWallet
            />
          </div>
        )}
      </div>
    </Alert>
  );
}
