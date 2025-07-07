"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  CheckIcon,
  ExternalLinkIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { z } from "zod";
import type { Team } from "@/api/team";
import type { TeamAccountRole } from "@/api/team-members";
import { GradientAvatar } from "@/components/blocks/avatar/gradient-avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
import { getValidTeamPlan } from "../../../../../../../../@/utils/getValidTeamPlan";

const inviteFormSchema = z.object({
  invites: z
    .array(
      z.object({
        email: z.string().email("Invalid email address"),
        role: z.enum(["OWNER", "MEMBER"] as const),
      }),
    )
    .min(1, "No invites added"),
});

export type RecommendedMember = {
  email: string;
  name: string | null;
  image: string | null;
};

type InviteFormValues = z.infer<typeof inviteFormSchema>;

// Note: This component is also used in team onboarding flow and not just in team settings page

export type InviteTeamMembersFn = (
  params: Array<{
    email: string;
    role: TeamAccountRole;
  }>,
) => Promise<{
  results: Array<"fulfilled" | "rejected">;
}>;

export function InviteSection(props: {
  team: Team;
  userHasEditPermission: boolean;
  inviteTeamMembers: InviteTeamMembersFn;
  customCTASection?: React.ReactNode;
  className?: string;
  onInviteSuccess?: (successCount: number) => void;
  shouldHideInviteButton?: boolean;
  recommendedMembers: RecommendedMember[];
  client: ThirdwebClient;
}) {
  const teamPlan = getValidTeamPlan(props.team);
  let bottomSection: React.ReactNode = null;
  const maxAllowedInvitesAtOnce = 10;
  // invites are enabled if user has edit permission and team plan is not "free"
  const inviteEnabled = teamPlan !== "free" && props.userHasEditPermission;

  const form = useForm<InviteFormValues>({
    defaultValues: {
      invites: [
        {
          email: "",
          role: "MEMBER",
        },
      ],
    },
    resolver: zodResolver(inviteFormSchema),
  });

  const sendInvites = useMutation({
    mutationFn: async (data: InviteFormValues) => {
      const res = await props.inviteTeamMembers(data.invites);
      return {
        inviteStatuses: res.results,
      };
    },
  });

  if (teamPlan === "free") {
    bottomSection = (
      <div className="lg:px6 flex items-center justify-between gap-4 border-border border-t px-4 py-4">
        <p className="text-muted-foreground text-sm">
          This feature is not available on the {teamPlan} plan.{" "}
          <Link
            className="text-link-foreground hover:text-foreground"
            href="https://thirdweb.com/pricing"
            rel="noopener noreferrer"
            target="_blank"
          >
            View plans <ExternalLinkIcon className="inline size-3" />
          </Link>
        </p>

        {props.customCTASection ? (
          props.customCTASection
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link
              className="gap-2"
              href={`/team/${props.team.slug}/~/billing?showPlans=true&highlight=growth`}
            >
              Upgrade
            </Link>
          </Button>
        )}
      </div>
    );
  } else if (!props.userHasEditPermission) {
    bottomSection = (
      <div className="flex min-h-[60px] items-center justify-between border-border border-t px-4 py-4 lg:px-6">
        <p className="text-muted-foreground text-sm">
          You don't have permission to invite members
        </p>
      </div>
    );
  } else {
    bottomSection = (
      <div className="flex items-center border-border border-t px-4 py-4 lg:justify-between lg:px-6">
        <p className="text-muted-foreground text-sm">
          Team members are billed according to your plan.{" "}
          <Link
            className="text-link-foreground hover:text-foreground"
            href="https://thirdweb.com/pricing"
            rel="noopener noreferrer"
            target="_blank"
          >
            View pricing <ExternalLinkIcon className="inline size-3" />
          </Link>
        </p>

        <div className="flex gap-3">
          {!props.shouldHideInviteButton && (
            <Button
              className="gap-2 max-sm:w-full"
              disabled={sendInvites.isPending}
              size="sm"
              type="submit"
              variant="default"
            >
              {sendInvites.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <UserPlusIcon className="size-4" />
              )}
              {form.watch("invites").length > 1
                ? "Send Invites"
                : "Send Invite"}
            </Button>
          )}

          {props.customCTASection}
        </div>
      </div>
    );
  }

  async function onSubmit(data: InviteFormValues) {
    if (!inviteEnabled) return;
    sendInvites.mutate(data, {
      onSuccess(data) {
        const inviteStatuses = data.inviteStatuses;

        const failedInvites = inviteStatuses.filter((r) => r === "rejected");
        const inviteOrInvites =
          data.inviteStatuses.length > 1 ? "invites" : "invite";

        if (failedInvites.length > 0) {
          // all invites failed
          if (failedInvites.length === data.inviteStatuses.length) {
            toast.error(`Failed to send ${inviteOrInvites}`);
          }
          // some invites failed
          else {
            toast.error(
              `Failed to send ${failedInvites.length} of ${data.inviteStatuses.length} ${inviteOrInvites}`,
            );
          }
        }

        // all invites succeeded
        else {
          toast.success(
            `Successfully sent ${data.inviteStatuses.length === 1 ? "" : data.inviteStatuses.length} ${inviteOrInvites}`,
          );

          if (props.onInviteSuccess) {
            props.onInviteSuccess(
              data.inviteStatuses.filter((r) => r === "fulfilled").length,
            );
          }
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onChange={() => {
          // when form updates - reset mutation result
          if (sendInvites.data) {
            sendInvites.reset();
          }
        }}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section>
          <div
            className={cn(
              "rounded-lg border border-border bg-card",
              props.className,
            )}
          >
            <div className="border-b px-4 py-4 lg:px-6">
              <h2 className="font-semibold text-lg tracking-tight">Invite</h2>

              <p className="text-muted-foreground text-sm">
                Invite new members to your team by email
              </p>
            </div>

            {props.recommendedMembers.length > 0 && (
              <RecommendedMembersSection
                client={props.client}
                isDisabled={!inviteEnabled}
                onToggleMember={(email) => {
                  const currentInvites = form
                    .getValues("invites")
                    .filter((x) => x.email !== "");

                  const inviteIndex = currentInvites.findIndex(
                    (invite) => invite.email === email,
                  );
                  if (inviteIndex !== -1) {
                    currentInvites.splice(inviteIndex, 1);
                  } else {
                    currentInvites.push({ email, role: "MEMBER" });
                  }

                  // must show at least one (even if its empty)
                  if (currentInvites.length === 0) {
                    currentInvites.push({ email: "", role: "MEMBER" });
                  }

                  form.setValue("invites", currentInvites, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
                recommendedMembers={props.recommendedMembers}
                selectedMembers={form
                  .watch("invites")
                  .map((invite) => invite.email)}
              />
            )}

            <div className="px-4 py-6 lg:px-6">
              <div className="flex flex-col gap-5">
                {form.watch("invites").map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: EXPECTED
                  <div className="flex items-start gap-4" key={index}>
                    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`invites.${index}.email`}
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel
                              className={cn(
                                !inviteEnabled && "text-muted-foreground",
                              )}
                            >
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="disabled:bg-muted"
                                disabled={!inviteEnabled}
                                placeholder="user@example.com"
                                type="email"
                              />
                            </FormControl>
                            {sendInvites.data && (
                              <div
                                className={cn(
                                  "mt-1 text-sm leading-none",
                                  sendInvites.data.inviteStatuses[index] ===
                                    "rejected" && "text-destructive-text",
                                  sendInvites.data.inviteStatuses[index] ===
                                    "fulfilled" && "text-success-text",
                                )}
                              >
                                {sendInvites.data.inviteStatuses[index] ===
                                "rejected"
                                  ? "Failed to send invite"
                                  : "Invite sent"}
                              </div>
                            )}

                            {!sendInvites.data && <FormMessage />}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`invites.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className={cn(
                                !inviteEnabled && "text-muted-foreground",
                              )}
                            >
                              Role
                            </FormLabel>
                            <FormControl>
                              <RoleSelector
                                disabled={!inviteEnabled}
                                onChange={field.onChange}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch("invites").length > 1 && (
                      <Button
                        className="mt-8 bg-background text-destructive-text disabled:cursor-not-allowed disabled:opacity-100"
                        onClick={() => {
                          const currentInvites = form.getValues("invites");
                          form.setValue(
                            "invites",
                            currentInvites.filter((_, i) => i !== index),
                          );
                        }}
                        type="button"
                        variant="outline"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  className="gap-2"
                  disabled={
                    !inviteEnabled ||
                    form.watch("invites").length >= maxAllowedInvitesAtOnce
                  }
                  onClick={() => {
                    const currentInvites = form.watch("invites");
                    form.setValue("invites", [
                      ...currentInvites,
                      { email: "", role: "MEMBER" },
                    ]);
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <PlusIcon className="size-4" />
                  Add Another
                </Button>

                <Button
                  className="gap-2"
                  disabled={!form.formState.isDirty}
                  onClick={() => {
                    form.reset();
                    sendInvites.reset();
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Reset
                </Button>
              </div>
            </div>

            {bottomSection}
          </div>
        </section>
      </form>
    </Form>
  );
}

function RoleSelector(props: {
  disabled?: boolean;
  value: TeamAccountRole;
  onChange: (v: TeamAccountRole) => void;
}) {
  const roles: TeamAccountRole[] = ["OWNER", "MEMBER"];

  return (
    <Select
      onValueChange={(v) => {
        props.onChange(v as TeamAccountRole);
      }}
      value={props.value}
    >
      <SelectTrigger
        className="capitalize disabled:bg-muted"
        disabled={props.disabled}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem className="capitalize" key={role} value={role}>
            {role.toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RecommendedMembersSection(props: {
  recommendedMembers: RecommendedMember[];
  selectedMembers: string[];
  onToggleMember: (email: string) => void;
  isDisabled: boolean;
  client: ThirdwebClient;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredMembers = props.recommendedMembers.filter((member) =>
    member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const membersToShow = isExpanded
    ? filteredMembers
    : filteredMembers.slice(0, 11);

  return (
    <div className="relative border-b">
      <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="">
          <h3 className="font-medium text-base">Recommended Members</h3>
          <p className="text-muted-foreground text-sm">
            Users with your team's verified domain in their email address that
            aren't added to your team yet
          </p>
        </div>

        <div className="relative flex items-center gap-2">
          <SearchIcon className="absolute left-3 size-4 text-muted-foreground" />
          <Input
            className="w-full bg-card pl-9 lg:w-72"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search Email"
            value={searchQuery}
          />
        </div>
      </div>

      {membersToShow.length === 0 && (
        <div className="px-4 pb-6 lg:px-6">
          <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
            No members found
          </div>
        </div>
      )}

      {membersToShow.length > 0 && (
        <div className="grid max-h-[294px] grid-cols-1 gap-3 overflow-y-auto px-4 pb-6 md:grid-cols-2 lg:px-6 xl:grid-cols-3">
          {membersToShow.map((member) => {
            const isSelected = props.selectedMembers.includes(member.email);
            return (
              <Button
                className={cn(
                  "relative flex h-auto w-auto items-center justify-between gap-2 rounded-lg border-dashed p-2.5 text-start hover:border-active-border hover:border-solid hover:bg-accent/50 disabled:opacity-100",
                  isSelected &&
                    "border-active-border border-solid bg-accent/50",
                )}
                disabled={props.isDisabled}
                key={member.email}
                onClick={() => {
                  props.onToggleMember(member.email);
                }}
                variant="outline"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <GradientAvatar
                    className="size-8 rounded-full border"
                    client={props.client}
                    id={member.email}
                    src={
                      member.image
                        ? resolveSchemeWithErrorHandler({
                            client: props.client,
                            uri: member.image,
                          })
                        : ""
                    }
                  />

                  <div className="truncate text-foreground text-sm">
                    {member.email}
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1">
                    <CheckIcon className="size-5 text-foreground" />
                  </div>
                )}
              </Button>
            );
          })}

          {filteredMembers.length > membersToShow.length && (
            <Button
              className="h-full rounded-lg border-dashed hover:border-active-border hover:border-solid hover:bg-accent/50"
              onClick={() => {
                setIsExpanded(true);
              }}
              size="sm"
              variant="outline"
            >
              + {filteredMembers.length - membersToShow.length} more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
