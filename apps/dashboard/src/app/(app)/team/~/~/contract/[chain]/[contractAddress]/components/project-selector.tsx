"use client";

import type { ThirdwebClient } from "thirdweb";
import type { PartialProject } from "@/api/getProjectContracts";
import type { Team } from "@/api/team";
import { useAddContractToProject } from "@/hooks/project-contracts";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { ProjectAndTeamSelectorCard } from "../../../../../components/TeamAndProjectSelectorCard";

export function SelectProjectForContract(props: {
  chainSlug: string;
  contractAddress: string;
  client: ThirdwebClient;
  teamAndProjects: {
    team: Team;
    projects: PartialProject[];
  }[];
}) {
  const router = useDashboardRouter();
  return (
    <ProjectAndTeamSelectorCard
      client={props.client}
      description={
        <>
          This contract is imported in multiple projects
          <br />
          Select a project to view this contract
        </>
      }
      onSelect={(selection) => {
        router.push(
          `/team/${selection.team.slug}/${selection.project.slug}/contract/${props.chainSlug}/${props.contractAddress}`,
        );
      }}
      teamAndProjects={props.teamAndProjects}
    />
  );
}

export function ImportAndSelectProjectForContract(props: {
  chainSlug: string;
  chainId: number;
  contractAddress: string;
  client: ThirdwebClient;
  teamAndProjects: {
    team: Team;
    projects: PartialProject[];
  }[];
}) {
  const router = useDashboardRouter();
  const addToProject = useAddContractToProject();
  return (
    <ProjectAndTeamSelectorCard
      client={props.client}
      description={
        <>
          This contract is not imported in any projects
          <br />
          Select a project to import the contract and continue
        </>
      }
      onSelect={(selection) => {
        // do not await - send request and move to the contract page
        addToProject.mutate({
          chainId: props.chainId.toString(),
          contractAddress: props.contractAddress,
          contractType: undefined,
          deploymentType: undefined,
          projectId: selection.project.id,
          teamId: selection.team.id,
        });

        router.push(
          `/team/${selection.team.slug}/${selection.project.slug}/contract/${props.chainSlug}/${props.contractAddress}`,
        );
      }}
      teamAndProjects={props.teamAndProjects}
    />
  );
}
