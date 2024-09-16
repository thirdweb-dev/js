"use client";

import type { Team } from "@/api/team";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Input } from "@/components/ui/input";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useMutation } from "@tanstack/react-query";
import { FileInput } from "components/shared/FileInput";
import { useState } from "react";
import { toast } from "sonner";
import { DangerSettingCard } from "./DangerSettingCard";
import { SettingsCard } from "./SettingsCard";

export function GeneralSettingsPage(props: {
  team: Team;
}) {
  const hasPermissionToDelete = false; // TODO
  return (
    <div className="flex flex-col gap-8">
      <TeamNameFormControl team={props.team} />
      <TeamSlugFormControl team={props.team} />
      <TeamAvatarFormControl />
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
}) {
  const [teamName, setTeamName] = useState(props.team.name);
  const maxTeamNameLength = 32;

  // TODO - implement
  const updateTeamMutation = useMutation({
    mutationFn: async (teamName: string) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Updating team name to", teamName);
      throw new Error("Not implemented");
    },
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
        isLoading: updateTeamMutation.isPending,
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
}) {
  const [teamSlug, setTeamSlug] = useState(props.team.slug);
  const [isTeamTaken] = useState(false);
  const maxTeamURLLength = 48;

  // TODO - implement
  const updateTeamMutation = useMutation({
    mutationFn: async (_slug: string) => {
      // set isTeamTaken to true if team URL is taken
      // Fake loading
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Updating team slug to", _slug);
      throw new Error("Not implemented");
    },
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
      errorText={
        isTeamTaken
          ? "Team URL is taken, Please choose another one."
          : undefined
      }
      saveButton={{
        onClick: handleSave,
        disabled: teamSlug.length === 0,
        isLoading: updateTeamMutation.isPending,
      }}
      noPermissionText={undefined} // TODO
    >
      <div className="relative border border-border rounded-lg flex md:w-[450px]">
        <div className="bg-muted/50 text-muted-foreground/80 self-stretch flex items-center px-3 text-sm border-r border-border rounded-l-lg font-mono">
          thirdweb.com/team/
        </div>
        <Input
          value={teamSlug}
          onChange={(e) => {
            setTeamSlug(e.target.value.slice(0, maxTeamURLLength));
          }}
          className="border-0 font-mono truncate"
        />
      </div>
    </SettingsCard>
  );
}

function TeamAvatarFormControl() {
  const [teamAvatar, setTeamAvatar] = useState<File>(); // TODO: prefill with team avatar

  // TODO - implement
  const updateTeamAvatarMutation = useMutation({
    mutationFn: async (_avatar: File | undefined) => {
      // Fake loading
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Updating team name to", _avatar);
      throw new Error("Not implemented");
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
        isLoading: updateTeamAvatarMutation.isPending,
      }}
      noPermissionText={undefined} // TODO
      errorText={undefined}
    >
      <div className="flex flex-row gap-4 md:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Team Avatar</h3>
          <p className="text-foreground text-sm mt-1.5 mb-4 leading-relaxed">
            This is your team's avatar. <br /> Click on the avatar to upload a
            custom one
          </p>
        </div>
        <FileInput
          accept={{ "image/*": [] }}
          value={teamAvatar}
          setValue={setTeamAvatar}
          className="w-20 lg:w-28 rounded-full"
          disableHelperText
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
      bottomText={"Used when interacting with the thirdweb API"}
      noPermissionText={undefined} // TODO
      errorText={undefined}
    >
      <CopyTextButton
        textToCopy={props.team.id}
        textToShow={props.team.id}
        variant="outline"
        className="font-mono px-3 w-full lg:w-[450px] justify-between text-muted-foreground bg-card truncate py-2"
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
        isLoading={leaveTeam.isPending}
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
    >
      {" "}
    </SettingsCard>
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
        isLoading={deleteTeam.isPending}
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
      noPermissionText={"You need additional permissions to delete your team."}
    >
      {" "}
    </SettingsCard>
  );
}
