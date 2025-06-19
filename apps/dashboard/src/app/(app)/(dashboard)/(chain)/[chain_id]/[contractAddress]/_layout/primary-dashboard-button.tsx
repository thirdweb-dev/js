"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
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
import type { EVMContractInfo } from "@3rdweb-sdk/react";
import {
  AddToProjectSelector,
  type MinimalTeamsAndProjects,
} from "components/contract-components/contract-deploy-form/add-to-project-card";

import { CodeIcon, PlusIcon } from "lucide-react";
import { CircleAlertIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Chain, ThirdwebClient } from "thirdweb";
import { useAddContractToProject } from "../../../../../team/[team_slug]/[project_slug]/(sidebar)/hooks/project-contracts";
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
    projectMeta,
    chainIdOrSlug: contractInfo.chainSlug,
    contractAddress: contractAddress,
    subpath: "/code",
  });

  // if user is not logged in
  if (!teamsAndProjects) {
    if (hideCodePageLink) {
      return null;
    }

    if (!pathname?.endsWith("/code")) {
      return (
        <Button variant="outline" asChild className="gap-2">
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
      <Button variant="default" asChild>
        <Link
          href={`/${contractInfo.chainSlug}/${contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="gap-2"
        >
          View Asset Page <ExternalLinkIcon className="size-3.5" />
        </Link>
      </Button>
    );
  }

  return (
    <AddToProjectButton
      contractAddress={contractAddress}
      teamsAndProjects={teamsAndProjects}
      chainId={chain.id.toString()}
      client={client}
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
          teamsAndProjects={props.teamsAndProjects}
          chainId={props.chainId}
          contractAddress={props.contractAddress}
          client={props.client}
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
    team: props.teamsAndProjects[0]?.team,
    project: props.teamsAndProjects[0]?.projects[0],
  });

  const selectedTeam = props.teamsAndProjects.find(
    (t) => t.team.id === importSelection.team?.id,
  );

  function handleImport(params: {
    teamId: string;
    projectId: string;
  }) {
    addContractToProject.mutate(
      {
        contractAddress: props.contractAddress,
        teamId: params.teamId,
        projectId: params.projectId,
        chainId: props.chainId,
        deploymentType: undefined,
        contractType: undefined,
      },
      {
        onSuccess: () => {
          toast.success("Contract added to the project successfully");
        },
        onError: (err) => {
          if (err.message.includes("PROJECT_CONTRACT_ALREADY_EXISTS")) {
            toast.error("Contract is already added to the project");
          } else {
            toast.error("Failed to import contract");
          }
        },
      },
    );
  }

  const isImportEnabled = !!importSelection.project && !!importSelection.team;

  return (
    <div>
      <div className="flex flex-col gap-4 border-border border-t px-6 py-6">
        <AddToProjectSelector
          selection={importSelection}
          onSelectionChange={setImportSelection}
          teamsAndProjects={props.teamsAndProjects}
          client={props.client}
        />

        {/* No projects alert */}
        {selectedTeam?.projects.length === 0 && (
          <Alert variant="info">
            <CircleAlertIcon className="size-5" />
            <AlertTitle> Selected team has no projects </AlertTitle>
            <AlertDescription>
              <UnderlineLink
                href={`/team/${selectedTeam.team.slug}`}
                className="inline-flex items-center gap-2"
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
          disabled={!isImportEnabled}
          className="gap-2"
          onClick={() => {
            if (!importSelection.team || !importSelection.project) {
              return;
            }

            handleImport({
              teamId: importSelection.team.id,
              projectId: importSelection.project.id,
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
