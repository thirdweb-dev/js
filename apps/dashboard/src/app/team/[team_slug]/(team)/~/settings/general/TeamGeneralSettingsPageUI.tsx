"use client";

import type { Team } from "@/api/team";
import { DangerSettingCard } from "@/components/blocks/DangerSettingCard";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Input } from "@/components/ui/input";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { FileInput } from "components/shared/FileInput";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";

type UpdateTeamField = (team: Partial<Team>) => Promise<void>;

export function TeamGeneralSettingsPageUI(props: {
  team: Team;
  updateTeamImage: (file: File | undefined) => Promise<void>;
  updateTeamField: UpdateTeamField;
  client: ThirdwebClient;
}) {
  const hasPermissionToDelete = false; // TODO
  return (
    <div className="flex flex-col gap-8">
      <TeamNameFormControl
        team={props.team}
        updateTeamField={props.updateTeamField}
      />
      <TeamSlugFormControl
        team={props.team}
        updateTeamField={props.updateTeamField}
      />
      <TeamAvatarFormControl
        updateTeamImage={props.updateTeamImage}
        avatar={props.team.image}
        client={props.client}
      />
      <TeamIdCard team={props.team} />
      <LeaveTeamCard enabled={false} teamName={props.team.name} />
      <DeleteTeamCard
        enabled={hasPermissionToDelete}
        teamName={props.team.name}
      />
    </div>
  );
}

function TeamNameFormControl(props: {
  team: Team;
  updateTeamField: UpdateTeamField;
}) {
  const [teamName, setTeamName] = useState(props.team.name);
  const maxTeamNameLength = 32;

  const updateTeamMutation = useMutation({
    mutationFn: (name: string) => props.updateTeamField({ name }),
  });

  function handleSave() {
    const promises = updateTeamMutation.mutateAsync(teamName);
    toast.promise(promises, {
      success: "Team name updated successfully",
      error: "Failed to update team name",
    });
  }

  return (
    <SettingsCard
      header={{
        title: "Team Name",
        description: "This is your team's name on thirdweb",
      }}
      bottomText={`Please use ${maxTeamNameLength} characters at maximum.`}
      saveButton={{
        onClick: handleSave,
        disabled: teamName.length === 0,
        isPending: updateTeamMutation.isPending,
      }}
      errorText={undefined}
      noPermissionText={undefined} // TODO
    >
      <Input
        value={teamName}
        onChange={(e) => {
          setTeamName(e.target.value.slice(0, maxTeamNameLength));
        }}
        className="md:w-[450px]"
      />
    </SettingsCard>
  );
}

function TeamSlugFormControl(props: {
  team: Team;
  updateTeamField: (team: Partial<Team>) => Promise<void>;
}) {
  const [teamSlug, setTeamSlug] = useState(props.team.slug);
  const maxTeamURLLength = 48;
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const updateTeamMutation = useMutation({
    mutationFn: (slug: string) => props.updateTeamField({ slug: slug }),
  });

  function handleSave() {
    const promises = updateTeamMutation.mutateAsync(teamSlug);
    toast.promise(promises, {
      success: "Team URL updated successfully",
      error: "Failed to update team URL",
    });
  }

  return (
    <SettingsCard
      header={{
        title: "Team URL",
        description:
          "This is your team's URL namespace on thirdweb. All your team's projects and settings can be accessed using this URL",
      }}
      bottomText={`Please use ${maxTeamURLLength} characters at maximum.`}
      errorText={errorMessage}
      saveButton={{
        onClick: handleSave,
        disabled: errorMessage !== undefined,
        isPending: updateTeamMutation.isPending,
      }}
      noPermissionText={undefined} // TODO
    >
      <div className="relative flex rounded-lg border border-border md:w-[450px]">
        <div className="flex items-center self-stretch rounded-l-lg border-border border-r bg-muted/50 px-3 font-mono text-muted-foreground/80 text-sm">
          thirdweb.com/team/
        </div>
        <Input
          value={teamSlug}
          onChange={(e) => {
            const value = e.target.value.slice(0, maxTeamURLLength);
            setTeamSlug(value);
            if (value.trim().length === 0) {
              setErrorMessage("Team URL can not be empty");
            } else if (/[^a-zA-Z0-9-]/.test(value)) {
              setErrorMessage(
                "Invalid Team URL. Only letters, numbers and hyphens are allowed",
              );
            } else {
              setErrorMessage(undefined);
            }
          }}
          className="truncate border-0 font-mono"
        />
      </div>
    </SettingsCard>
  );
}

function TeamAvatarFormControl(props: {
  updateTeamImage: (file: File | undefined) => Promise<void>;
  avatar: string | undefined;
  client: ThirdwebClient;
}) {
  const teamAvatarUrl = resolveSchemeWithErrorHandler({
    client: props.client,
    uri: props.avatar,
  });

  const [teamAvatar, setTeamAvatar] = useState<File | undefined>();

  const updateTeamAvatarMutation = useMutation({
    mutationFn: async (_avatar: File | undefined) => {
      await props.updateTeamImage(_avatar);
    },
  });

  function handleSave() {
    const promises = updateTeamAvatarMutation.mutateAsync(teamAvatar);
    toast.promise(promises, {
      success: "Team avatar updated successfully",
      error: "Failed to update team avatar",
    });
  }

  return (
    <SettingsCard
      bottomText="An avatar is optional but strongly recommended."
      saveButton={{
        onClick: handleSave,
        disabled: false,
        isPending: updateTeamAvatarMutation.isPending,
      }}
      noPermissionText={undefined} // TODO
      errorText={undefined}
    >
      <div className="flex flex-row gap-4 md:justify-between">
        <div>
          <h3 className="font-semibold text-xl tracking-tight">Team Avatar</h3>
          <p className="mt-1.5 mb-4 text-foreground text-sm leading-relaxed">
            This is your team's avatar. <br /> Click on the avatar to upload a
            custom one
          </p>
        </div>
        <FileInput
          accept={{ "image/*": [] }}
          value={teamAvatar}
          setValue={setTeamAvatar}
          className="w-20 rounded-full lg:w-28"
          disableHelperText
          fileUrl={teamAvatarUrl}
        />
      </div>
    </SettingsCard>
  );
}

function TeamIdCard(props: {
  team: Team;
}) {
  return (
    <SettingsCard
      header={{
        title: "Team ID",
        description: "This is your team's ID on thirdweb",
      }}
      bottomText="Used when interacting with the thirdweb API"
      noPermissionText={undefined} // TODO
      errorText={undefined}
    >
      <CopyTextButton
        textToCopy={props.team.id}
        textToShow={props.team.id}
        variant="outline"
        className="w-full justify-between truncate bg-card px-3 py-2 font-mono text-muted-foreground lg:w-[450px]"
        tooltip="Copy Team ID"
        copyIconPosition="right"
      />
    </SettingsCard>
  );
}

export function LeaveTeamCard(props: {
  enabled: boolean;
  teamName: string;
}) {
  const title = "Leave Team";
  const description =
    "Revoke your access to this Team. Any resources you've added to the Team will remain.";

  // TODO
  const leaveTeam = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Deleting team");
      throw new Error("Not implemented");
    },
  });

  function handleLeave() {
    const promises = leaveTeam.mutateAsync();
    toast.promise(promises, {
      success: "Left team successfully",
      error: "Failed to leave team",
    });
  }

  if (props.enabled) {
    return (
      <DangerSettingCard
        title={title}
        description={description}
        buttonLabel={title}
        buttonOnClick={handleLeave}
        isPending={leaveTeam.isPending}
        confirmationDialog={{
          title: `Are you sure you want to leave team "${props.teamName}" ?`,
          description:
            "This will revoke your access to this Team. Any resources you've added to the Team will remain.",
        }}
      />
    );
  }

  return (
    <SettingsCard
      header={{
        title,
        description,
      }}
      bottomText="To leave this Team, ensure at least one more Member has the Owner role."
      errorText={undefined}
      noPermissionText={undefined}
    />
  );
}

export function DeleteTeamCard(props: {
  enabled: boolean;
  teamName: string;
}) {
  const router = useDashboardRouter();
  const title = "Delete Team";
  const description =
    "Permanently remove your team and all of its contents from the thirdweb platform. This action is not reversible - please continue with caution.";

  // TODO
  const deleteTeam = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Deleting team");
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      router.push("/team");
    },
  });

  function handleDelete() {
    const promises = deleteTeam.mutateAsync();
    toast.promise(promises, {
      success: "Team deleted successfully",
      error: "Failed to delete team",
    });
  }

  if (props.enabled) {
    return (
      <DangerSettingCard
        title={title}
        description={description}
        buttonLabel={title}
        buttonOnClick={handleDelete}
        isPending={deleteTeam.isPending}
        confirmationDialog={{
          title: `Are you sure you want to delete team "${props.teamName}" ?`,
          description: description,
        }}
      />
    );
  }

  return (
    <SettingsCard
      header={{
        title,
        description,
      }}
      bottomText=""
      errorText={undefined}
      noPermissionText="You need additional permissions to delete your team."
    />
  );
}
