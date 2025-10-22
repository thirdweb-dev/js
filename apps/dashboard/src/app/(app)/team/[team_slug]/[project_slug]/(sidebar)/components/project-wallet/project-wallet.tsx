"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UnderlineLink } from "@workspace/ui/components/UnderlineLink";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { listProjectServerWallets } from "@/actions/project-wallet/list-server-wallets";
import type { Project } from "@/api/project/projects";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ProjectWalletSummary } from "@/lib/server/project-wallet";
import { updateDefaultProjectWallet } from "../../transactions/lib/vault.client";
import { CreateServerWallet } from "../../transactions/server-wallets/components/create-server-wallet.client";
import { ProjectWalletDetailsSection } from "./project-wallet-details";

type GetProjectServerWallets = (params: {
  managementAccessToken: string;
  projectId: string;
}) => Promise<ProjectWalletSummary[]>;

function CreateProjectWalletSection(props: {
  project: Project;
  teamSlug: string;
  getProjectServerWallets: GetProjectServerWallets;
}) {
  const { project, teamSlug } = props;
  const router = useDashboardRouter();
  const queryClient = useQueryClient();
  const client = useMemo(() => getClientThirdwebClient(), []);
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>(
    undefined,
  );
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);

  const managementAccessToken =
    props.project.services?.find((service) => service.name === "engineCloud")
      ?.managementAccessToken ?? undefined;

  const serverWalletsQuery = useQuery({
    enabled: Boolean(managementAccessToken),
    queryFn: async () => {
      if (!managementAccessToken) {
        return [] as ProjectWalletSummary[];
      }

      return props.getProjectServerWallets({
        managementAccessToken,
        projectId: project.id,
      });
    },
    queryKey: ["project", project.id, "server-wallets", managementAccessToken],
    refetchOnWindowFocus: false,
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
      setIsSelectDialogOpen(false);
      router.refresh();
    },
  });

  const canSelectExisting =
    Boolean(managementAccessToken) && serverWallets.length > 0;

  return (
    <div className="rounded-xl border p-4 bg-card">
      <div className="rounded-full p-2 border bg-background inline-flex mb-4">
        <XIcon className="size-3.5 text-muted-foreground" />
      </div>
      <h2 className="text-sm font-medium text-foreground mb-0.5">
        No Project Wallet set
      </h2>
      <p className="text-sm text-muted-foreground">
        Set a project wallet to set the default sender in thirdweb API.
      </p>

      <div className="mt-4 space-y-5 text-foreground">
        {serverWalletsQuery.isLoading ? (
          <Skeleton className="h-[36px] max-w-lg rounded-full" />
        ) : canSelectExisting ? (
          <div className="flex items-center gap-3">
            <Button
              className="bg-background rounded-full gap-2"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedWalletId(effectiveSelectedWalletId);
                setIsSelectDialogOpen(true);
              }}
              type="button"
            >
              <ChevronDownIcon className="size-4 text-muted-foreground" />
              Select a server wallet
            </Button>

            <CreateServerWallet
              project={project}
              teamSlug={teamSlug}
              setAsProjectWallet
              button={{ size: "sm", iconClassName: "size-3.5" }}
            />

            <Dialog
              onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                  setIsSelectDialogOpen(false);
                }
              }}
              open={isSelectDialogOpen}
            >
              <DialogContent className="gap-0 p-0 overflow-hidden">
                <DialogHeader className="p-4 lg:p-6">
                  <DialogTitle>Select project wallet</DialogTitle>
                  <DialogDescription>
                    Choose a server wallet to use as the default for this
                    project.
                  </DialogDescription>
                </DialogHeader>

                <div className="px-4 pb-8 lg:px-6">
                  {serverWalletsQuery.isLoading ? (
                    <div className="flex justify-center py-6">
                      <Spinner className="size-5" />
                    </div>
                  ) : serverWallets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No server wallets found.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Select
                        onValueChange={(value) => setSelectedWalletId(value)}
                        value={selectedWalletId ?? ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select server wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          {serverWallets.map((wallet) => (
                            <SelectItem key={wallet.id} value={wallet.id}>
                              <div className="flex items-center gap-3">
                                <WalletAddress
                                  address={wallet.address}
                                  client={client}
                                  className="h-auto py-1"
                                />
                                <span className="text-sm text-muted-foreground">
                                  {wallet.label}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t bg-card p-4 lg:p-6">
                  <Button
                    onClick={() => {
                      setIsSelectDialogOpen(false);
                    }}
                    type="button"
                    variant="outline"
                    disabled={setDefaultWalletMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      !selectedWallet || setDefaultWalletMutation.isPending
                    }
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
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-muted-foreground">
            <CreateServerWallet
              project={project}
              teamSlug={teamSlug}
              setAsProjectWallet
              button={{ size: "sm", iconClassName: "size-3.5" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectWalletSectionUI(props: {
  project: Project;
  teamSlug: string;
  projectWallet: ProjectWalletSummary | undefined;
  getProjectServerWallets: GetProjectServerWallets;
  client: ThirdwebClient;
}) {
  return (
    <div>
      <div className="mb-3">
        <h2 className="mb-1 font-semibold text-xl tracking-tight">
          Project Wallet
        </h2>
        <p className="text-muted-foreground text-sm">
          The server wallet to be used as the default sender in{" "}
          <UnderlineLink
            href="https://portal.thirdweb.com/reference"
            target="_blank"
          >
            thirdweb API
          </UnderlineLink>
        </p>
      </div>

      {props.projectWallet ? (
        <ProjectWalletDetailsSection
          project={props.project}
          projectWallet={props.projectWallet}
          client={props.client}
          teamSlug={props.teamSlug}
          getProjectServerWallets={props.getProjectServerWallets}
        />
      ) : (
        <CreateProjectWalletSection
          project={props.project}
          teamSlug={props.teamSlug}
          getProjectServerWallets={props.getProjectServerWallets}
        />
      )}
    </div>
  );
}

export function ProjectWalletSection(props: {
  project: Project;
  teamSlug: string;
  projectWallet: ProjectWalletSummary | undefined;
  client: ThirdwebClient;
}) {
  return (
    <ProjectWalletSectionUI
      project={props.project}
      teamSlug={props.teamSlug}
      client={props.client}
      projectWallet={props.projectWallet}
      getProjectServerWallets={listProjectServerWallets}
    />
  );
}
