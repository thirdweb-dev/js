"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { createDedicatedSupportChannel } from "@/api/dedicated-support";
import type { Team } from "@/api/team";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardRouter } from "@/lib/DashboardRouter";

const CHANNEL_TYPES = {
  slack: "Slack",
  telegram: "Telegram (Coming Soon)",
} as const;

type ChannelType = keyof typeof CHANNEL_TYPES;

export function TeamDedicatedSupportCard(props: {
  team: Team;
  isOwnerAccount: boolean;
}) {
  const router = useDashboardRouter();
  const [selectedChannelType, setSelectedChannelType] =
    useState<ChannelType>("slack");

  const isFeatureEnabled =
    props.team.billingPlan === "scale" || props.team.billingPlan === "pro";

  const createMutation = useMutation({
    mutationFn: async (params: {
      teamId: string;
      channelType: ChannelType;
    }) => {
      const res = await createDedicatedSupportChannel(
        params.teamId,
        params.channelType,
      );
      if (res.error) {
        throw new Error(res.error);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(
        "Dedicated support channel requested. Please check your email for an invite link shortly.",
      );
    },
  });

  const channelType = props.team.dedicatedSupportChannel?.type;
  const channelName = props.team.dedicatedSupportChannel?.name;

  const hasDefaultTeamName = props.team.name.startsWith("Your Projects");

  // Already set up.
  if (channelType && channelName) {
    return (
      <SettingsCard
        bottomText={undefined}
        errorText={undefined}
        header={{
          description:
            "Get a dedicated support channel with the thirdweb team.",
          title: "Dedicated Support",
        }}
        noPermissionText={undefined}
      >
        <div className="md:w-[450px]">
          <p className="text-muted-foreground text-sm">
            Your dedicated support channel: #<strong>{channelName}</strong>{" "}
            {CHANNEL_TYPES[channelType]}
          </p>
        </div>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard
      bottomText={
        !isFeatureEnabled ? (
          <>
            Upgrade to the <b>Scale</b> or <b>Pro</b> plan to unlock this
            feature.
          </>
        ) : hasDefaultTeamName ? (
          "Please update your team name before requesting a dedicated support channel."
        ) : undefined
      }
      errorText={undefined}
      header={{
        description: "Get a dedicated support channel with the thirdweb team.",
        title: "Dedicated Support",
      }}
      noPermissionText={
        !props.isOwnerAccount
          ? "Only team owners can request a dedicated support channel."
          : undefined
      }
      saveButton={
        isFeatureEnabled
          ? {
              disabled: createMutation.isPending,
              isPending: createMutation.isPending,
              label: "Create Support Channel",
              onClick: () =>
                createMutation.mutate({
                  channelType: selectedChannelType,
                  teamId: props.team.id,
                }),
            }
          : hasDefaultTeamName
            ? {
                disabled: false,
                isPending: false,
                label: "Update Team Name",
                onClick: () =>
                  router.push(`/team/${props.team.slug}/~/settings`),
              }
            : {
                disabled: false,
                isPending: false,
                label: "Upgrade Plan",
                onClick: () =>
                  router.push(
                    `/team/${props.team.slug}/~/settings/billing?showPlans=true&highlight=scale`,
                  ),
              }
      }
    >
      <div className="md:w-[450px]">
        <Select
          disabled={
            !isFeatureEnabled || hasDefaultTeamName || createMutation.isPending
          }
          onValueChange={(val) => setSelectedChannelType(val as ChannelType)}
          value={selectedChannelType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Channel Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CHANNEL_TYPES).map(([value, name]) => (
              <SelectItem
                disabled={value === "telegram"}
                key={value}
                value={value}
              >
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="mt-2 text-muted-foreground text-sm">
        All current members of this team will be sent an invite link to their
        email. You can invite other members later.
      </p>
    </SettingsCard>
  );
}
