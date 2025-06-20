"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FileInput } from "components/shared/FileInput";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { z } from "zod";
import { deleteTeam } from "@/actions/deleteTeam";
import type { Team } from "@/api/team";
import type { VerifiedDomainResponse } from "@/api/verified-domain";
import { DangerSettingCard } from "@/components/blocks/DangerSettingCard";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Input } from "@/components/ui/input";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { TeamDomainVerificationCard } from "../_components/settings-cards/domain-verification";
import {
  maxTeamNameLength,
  maxTeamSlugLength,
  teamNameSchema,
  teamSlugSchema,
} from "./common";

type UpdateTeamField = (team: Partial<Team>) => Promise<void>;

export function TeamGeneralSettingsPageUI(props: {
  team: Team;
  initialVerification: VerifiedDomainResponse | null;
  isOwnerAccount: boolean;
  updateTeamImage: (file: File | undefined) => Promise<void>;
  updateTeamField: UpdateTeamField;
  client: ThirdwebClient;
  leaveTeam: () => Promise<void>;
}) {
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
        avatar={props.team.image}
        client={props.client}
        updateTeamImage={props.updateTeamImage}
      />
      <TeamIdCard team={props.team} />
      <TeamDomainVerificationCard
        initialVerification={props.initialVerification}
        isOwnerAccount={props.isOwnerAccount}
        teamId={props.team.id}
      />

      <LeaveTeamCard leaveTeam={props.leaveTeam} teamName={props.team.name} />
      <DeleteTeamCard
        canDelete={props.isOwnerAccount}
        teamId={props.team.id}
        teamName={props.team.name}
      />
    </div>
  );
}

const teamNameFormSchema = z.object({
  name: teamNameSchema,
});

function TeamNameFormControl(props: {
  team: Team;
  updateTeamField: UpdateTeamField;
}) {
  const form = useForm<{ name: string }>({
    resolver: zodResolver(teamNameFormSchema),
    values: { name: props.team.name },
  });
  const updateTeamMutation = useMutation({
    mutationFn: (name: string) => props.updateTeamField({ name }),
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        const promise = updateTeamMutation.mutateAsync(values.name);
        toast.promise(promise, {
          error: "Failed to update team name",
          success: "Team name updated successfully",
        });
      })}
    >
      <SettingsCard
        bottomText={`Please use ${maxTeamNameLength} characters at maximum.`}
        errorText={form.formState.errors.name?.message}
        header={{
          description: "This is your team's name on thirdweb",
          title: "Team Name",
        }}
        noPermissionText={undefined}
        saveButton={{
          disabled: !form.formState.isDirty,
          isPending: updateTeamMutation.isPending,
          type: "submit",
        }}
      >
        <Input
          {...form.register("name")}
          className="md:w-[450px]"
          maxLength={maxTeamNameLength}
        />
      </SettingsCard>
    </form>
  );
}

const teamSlugFormSchema = z.object({
  slug: teamSlugSchema,
});

function TeamSlugFormControl(props: {
  team: Team;
  updateTeamField: (team: Partial<Team>) => Promise<void>;
}) {
  const form = useForm<{ slug: string }>({
    defaultValues: { slug: props.team.slug },
    resolver: zodResolver(teamSlugFormSchema),
  });
  const updateTeamMutation = useMutation({
    mutationFn: (slug: string) => props.updateTeamField({ slug }),
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        const promise = updateTeamMutation.mutateAsync(values.slug);
        toast.promise(promise, {
          error: "Failed to update team URL",
          success: "Team URL updated successfully",
        });
      })}
    >
      <SettingsCard
        bottomText={`Please use ${maxTeamSlugLength} characters at maximum.`}
        errorText={form.formState.errors.slug?.message}
        header={{
          description:
            "This is your team's URL namespace on thirdweb. All your team's projects and settings can be accessed using this URL",
          title: "Team URL",
        }}
        noPermissionText={undefined}
        saveButton={{
          disabled: !form.formState.isDirty,
          isPending: updateTeamMutation.isPending,
          type: "submit",
        }}
      >
        <div className="relative flex rounded-lg border border-border md:w-[450px]">
          <div className="flex items-center self-stretch rounded-l-lg border-border border-r bg-card px-3 font-mono text-muted-foreground/80 text-sm">
            thirdweb.com/team/
          </div>
          <Input
            {...form.register("slug")}
            className="truncate border-0 font-mono"
            maxLength={maxTeamSlugLength}
          />
        </div>
      </SettingsCard>
    </form>
  );
}

function TeamAvatarFormControl(props: {
  updateTeamImage: (file: File | undefined) => Promise<void>;
  avatar: string | null;
  client: ThirdwebClient;
}) {
  const teamAvatarUrl = resolveSchemeWithErrorHandler({
    client: props.client,
    uri: props.avatar || undefined,
  });

  const [teamAvatar, setTeamAvatar] = useState<File | undefined>();

  const updateTeamAvatarMutation = useMutation({
    mutationFn: async (_avatar: File | undefined) => {
      await props.updateTeamImage(_avatar);
    },
  });

  function handleSave() {
    const promise = updateTeamAvatarMutation.mutateAsync(teamAvatar);
    toast.promise(promise, {
      error: "Failed to update team avatar",
      success: "Team avatar updated successfully",
    });
  }

  return (
    <SettingsCard
      bottomText="An avatar is optional but strongly recommended."
      errorText={undefined}
      noPermissionText={undefined}
      saveButton={{
        disabled: false,
        isPending: updateTeamAvatarMutation.isPending,
        onClick: handleSave,
      }}
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
          className="w-20 rounded-full lg:w-28"
          client={props.client}
          disableHelperText
          setValue={setTeamAvatar}
          value={teamAvatar || teamAvatarUrl}
        />
      </div>
    </SettingsCard>
  );
}

function TeamIdCard(props: { team: Team }) {
  return (
    <SettingsCard
      bottomText="Used when interacting with the thirdweb API"
      errorText={undefined}
      header={{
        description: "This is your team's ID on thirdweb",
        title: "Team ID",
      }} // TODO
      noPermissionText={undefined}
    >
      <CopyTextButton
        className="w-full justify-between truncate bg-background px-3 py-2 font-mono text-muted-foreground lg:w-[450px]"
        copyIconPosition="right"
        textToCopy={props.team.id}
        textToShow={props.team.id}
        tooltip="Copy Team ID"
        variant="outline"
      />
    </SettingsCard>
  );
}

export function LeaveTeamCard(props: {
  teamName: string;
  leaveTeam: () => Promise<void>;
}) {
  const title = "Leave Team";
  const description =
    "Revoke your access to this Team. Any resources you've added to the Team will remain.";

  const leaveTeam = useMutation({
    mutationFn: props.leaveTeam,
  });

  function handleLeave() {
    const promise = leaveTeam.mutateAsync();
    toast.promise(promise, {
      error: "Failed to leave team",
      success: "Left team successfully",
    });
  }

  return (
    <DangerSettingCard
      buttonLabel={title}
      buttonOnClick={handleLeave}
      confirmationDialog={{
        description:
          "This will revoke your access to this Team. Any resources you've added to the Team will remain.",
        title: `Are you sure you want to leave team "${props.teamName}" ?`,
      }}
      description={description}
      isPending={leaveTeam.isPending}
      title={title}
    />
  );
}

export function DeleteTeamCard(props: {
  canDelete: boolean;
  teamId: string;
  teamName: string;
}) {
  const router = useDashboardRouter();
  const title = "Delete Team";
  const description =
    "Permanently remove your team and all of its contents from the thirdweb platform. This action is not reversible - please continue with caution.";

  const deleteTeamAndRedirect = useMutation({
    mutationFn: async () => {
      const result = await deleteTeam({ teamId: props.teamId });
      if (result.status === "error") {
        throw new Error(result.errorMessage);
      }
    },
    onSuccess: () => {
      router.push("/team");
    },
  });

  function handleDelete() {
    const promise = deleteTeamAndRedirect.mutateAsync();
    toast.promise(promise, {
      error: "Failed to delete team",
      success: "Team deleted",
    });
  }

  if (props.canDelete) {
    return (
      <DangerSettingCard
        buttonLabel={title}
        buttonOnClick={handleDelete}
        confirmationDialog={{
          description: description,
          title: `Are you sure you want to delete team "${props.teamName}" ?`,
        }}
        description={description}
        isPending={deleteTeamAndRedirect.isPending}
        title={title}
      />
    );
  }

  return (
    <SettingsCard
      bottomText=""
      errorText={undefined}
      header={{
        description,
        title,
      }}
      noPermissionText="You need additional permissions to delete your team."
    />
  );
}
