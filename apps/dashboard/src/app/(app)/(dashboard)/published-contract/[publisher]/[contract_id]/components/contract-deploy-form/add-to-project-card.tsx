"use client";

import { CircleAlertIcon, ExternalLinkIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { AddToProjectSelector } from "@/components/contracts/import-contract/add-to-project-selector";
import type {
  MinimalTeamsAndProjects,
  TeamAndProjectSelection,
} from "@/components/contracts/import-contract/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { ContractDeploymentFieldset } from "./common";

type TeamAndProjectSelectorProps = {
  teamsAndProjects: MinimalTeamsAndProjects;
  selection: TeamAndProjectSelection;
  enabled: boolean;
  onSelectionChange: (selection: TeamAndProjectSelection) => void;
  client: ThirdwebClient;
  onSetEnabled: (enabled: boolean) => void;
};

export function AddToProjectCardUI(props: TeamAndProjectSelectorProps) {
  const selectedTeam = props.teamsAndProjects.find(
    (t) => t.team.id === props.selection.team?.id,
  );

  const isProjectSelected = props.selection.project && props.enabled;

  return (
    <ContractDeploymentFieldset
      description="Save the deployed contract in a project's contract list on thirdweb dashboard"
      headerChildren={
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
          <Checkbox
            checked={props.enabled}
            className="size-5"
            onCheckedChange={(checked) => {
              props.onSetEnabled(!!checked);
            }}
          />
        </div>
      }
      headerClassName="pr-14"
      legend="Add To Project"
    >
      <div className="flex flex-col gap-5">
        {/* Team & Project selectors */}
        {props.enabled && (
          <AddToProjectSelector
            client={props.client}
            onSelectionChange={props.onSelectionChange}
            selection={props.selection}
            teamsAndProjects={props.teamsAndProjects}
          />
        )}

        {/* No projects alert */}
        {selectedTeam?.projects.length === 0 && (
          <Alert variant="info">
            <CircleAlertIcon className="size-5" />
            <AlertTitle> Selected team has no projects </AlertTitle>
            <AlertDescription>
              <UnderlineLink
                className="inline-flex items-center gap-2"
                href={`/team/${selectedTeam.team.slug}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Create Project <ExternalLinkIcon className="size-3.5" />
              </UnderlineLink>
            </AlertDescription>
          </Alert>
        )}

        {/* No project selected alert */}
        {!isProjectSelected && (
          <Alert variant="warning">
            <CircleAlertIcon className="size-5" />
            <AlertTitle>No Project Selected</AlertTitle>
            <AlertDescription>
              Deployed contract will not be saved in thirdweb dashboard
            </AlertDescription>
          </Alert>
        )}
      </div>
    </ContractDeploymentFieldset>
  );
}
