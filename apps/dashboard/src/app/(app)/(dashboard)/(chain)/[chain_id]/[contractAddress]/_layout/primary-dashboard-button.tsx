"use client";

import {
  CircleAlertIcon,
  CodeIcon,
  ExternalLinkIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Chain, ThirdwebClient } from "thirdweb";
import {
  AddToProjectSelector,
  type MinimalTeamsAndProjects,
} from "@/components/contract-components/contract-deploy-form/add-to-project-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { useAddContractToProject } from "@/hooks/project-contracts";
import type { EVMContractInfo } from "@/hooks/useActiveChainId";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../_utils/contract-page-path";

type AddToDashboardCardProps = {
  contractAddress: string;
  chain: Chain;
  contractInfo: EVMContractInfo;
  hideCodePageLink?: boolean;
  teamsAndProjects: MinimalTeamsAndProjects | undefined;
  client: ThirdwebClient;
  projectMeta: ProjectMeta | undefined;
};

export const PrimaryDashboardButton: React.FC<AddToDashboardCardProps> = ({
  contractAddress,
  chain,
  contractInfo,
  hideCodePageLink,
  teamsAndProjects,
  client,
  projectMeta,
}) => {
  const pathname = usePathname();

  const codePagePath = buildContractPagePath({
    chainIdOrSlug: contractInfo.chainSlug,
    contractAddress: contractAddress,
    projectMeta,
    subpath: "/code",
  });

  // if user is not logged in
  if (!teamsAndProjects) {
    if (hideCodePageLink) {
      return null;
    }

    if (!pathname?.endsWith("/code")) {
      return (
        <Button asChild className="gap-2" variant="outline">
          <Link href={codePagePath}>
            <CodeIcon className="size-4" />
            Code Snippets
          </Link>
        </Button>
      );
    }

    return null;
  }

  // if user is on a project page
  if (projectMeta) {
    return (
      <Button asChild className="rounded-full" variant="default">
        <Link
          className="gap-2"
          href={`/${contractInfo.chainSlug}/${contractAddress}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          View Token Page <ExternalLinkIcon className="size-3.5" />
        </Link>
      </Button>
    );
  }

  return (
    <AddToProjectButton
      chainId={chain.id.toString()}
      client={client}
      contractAddress={contractAddress}
      teamsAndProjects={teamsAndProjects}
    />
  );
};

function AddToProjectButton(props: {
  contractAddress: string;
  teamsAndProjects: MinimalTeamsAndProjects;
  chainId: string;
  client: ThirdwebClient;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-card" variant="outline">
          <PlusIcon className="size-4" />
          Add To Project
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden p-0">
        <DialogHeader className="p-6">
          <DialogTitle>Add To Project</DialogTitle>
          <DialogDescription>
            Add the contract in a project's contract list on dashboard
          </DialogDescription>
        </DialogHeader>
        <AddToProjectModalContent
          chainId={props.chainId}
          client={props.client}
          contractAddress={props.contractAddress}
          teamsAndProjects={props.teamsAndProjects}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddToProjectModalContent(props: {
  teamsAndProjects: MinimalTeamsAndProjects;
  chainId: string;
  contractAddress: string;
  client: ThirdwebClient;
}) {
  const addContractToProject = useAddContractToProject();

  const [importSelection, setImportSelection] = useState({
    project: props.teamsAndProjects[0]?.projects[0],
    team: props.teamsAndProjects[0]?.team,
  });

  const selectedTeam = props.teamsAndProjects.find(
    (t) => t.team.id === importSelection.team?.id,
  );

  function handleImport(params: { teamId: string; projectId: string }) {
    addContractToProject.mutate(
      {
        chainId: props.chainId,
        contractAddress: props.contractAddress,
        contractType: undefined,
        deploymentType: undefined,
        projectId: params.projectId,
        teamId: params.teamId,
      },
      {
        onError: (err) => {
          if (err.message.includes("PROJECT_CONTRACT_ALREADY_EXISTS")) {
            toast.error("Contract is already added to the project");
          } else {
            toast.error("Failed to import contract");
          }
        },
        onSuccess: () => {
          toast.success("Contract added to the project successfully");
        },
      },
    );
  }

  const isImportEnabled = !!importSelection.project && !!importSelection.team;

  return (
    <div>
      <div className="flex flex-col gap-4 border-border border-t px-6 py-6">
        <AddToProjectSelector
          client={props.client}
          onSelectionChange={setImportSelection}
          selection={importSelection}
          teamsAndProjects={props.teamsAndProjects}
        />

        {/* No projects alert */}
        {selectedTeam?.projects.length === 0 && (
          <Alert variant="info">
            <CircleAlertIcon className="size-5" />
            <AlertTitle> Selected team has no projects </AlertTitle>
            <AlertDescription>
              <UnderlineLink
                className="inline-flex items-center gap-2"
                href={`/team/${selectedTeam.team.slug}`}
                target="_blank"
              >
                Create Project <ExternalLinkIcon className="size-3.5" />
              </UnderlineLink>
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="mt-3 flex justify-end border-border border-t bg-card p-6">
        <Button
          className="gap-2"
          disabled={!isImportEnabled}
          onClick={() => {
            if (!importSelection.team || !importSelection.project) {
              return;
            }

            handleImport({
              projectId: importSelection.project.id,
              teamId: importSelection.team.id,
            });
          }}
        >
          {addContractToProject.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <PlusIcon className="size-4" />
          )}
          Add to Project
        </Button>
      </div>
    </div>
  );
}
