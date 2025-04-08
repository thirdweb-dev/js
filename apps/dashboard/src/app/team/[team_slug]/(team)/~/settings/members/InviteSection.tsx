"use client";
import type { Team } from "@/api/team";
import type { TeamAccountRole } from "@/api/team-members";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ExternalLinkIcon, PlusIcon, Trash2Icon, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getValidTeamPlan } from "../../../../../components/TeamHeader/getValidTeamPlan";

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
  onInviteSuccess?: () => void;
  shouldHideInviteButton?: boolean;
}) {
  const teamPlan = getValidTeamPlan(props.team);
  let bottomSection: React.ReactNode = null;
  const maxAllowedInvitesAtOnce = 10;
  // invites are enabled if user has edit permission and team plan is not "free"
  const inviteEnabled = teamPlan !== "free" && props.userHasEditPermission;

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      invites: [
        {
          email: "",
          role: "MEMBER",
        },
      ],
    },
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
            href="https://thirdweb.com/pricing"
            target="_blank"
            className="text-link-foreground hover:text-foreground"
          >
            View plans <ExternalLinkIcon className="inline size-3" />
          </Link>
        </p>

        {props.customCTASection ? (
          props.customCTASection
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/team/${props.team.slug}/~/settings/billing`}
              className="gap-2"
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
        {teamPlan === "pro" ? (
          <p className="text-muted-foreground text-sm">
            Team members are billed according to your plan.{" "}
            <Link
              href="https://meetings.hubspot.com/sales-thirdweb/thirdweb-pro"
              target="_blank"
              className="text-link-foreground hover:text-foreground"
            >
              Reach out to sales <ExternalLinkIcon className="inline size-3" />.
            </Link>
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Team members are billed according to your plan.{" "}
            <Link
              href="https://thirdweb.com/pricing"
              target="_blank"
              className="text-link-foreground hover:text-foreground"
            >
              View pricing <ExternalLinkIcon className="inline size-3" />
            </Link>
          </p>
        )}

        <div className="flex gap-3">
          {!props.shouldHideInviteButton && (
            <Button
              variant="default"
              size="sm"
              className="gap-2 max-sm:w-full"
              type="submit"
              disabled={sendInvites.isPending}
            >
              {sendInvites.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <UserPlus className="size-4" />
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
            props.onInviteSuccess();
          }
        }
      },
    });
  }

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // when form updates - reset mutation result
    const subscription = form.watch(() => {
      sendInvites.reset();
    });

    return () => subscription.unsubscribe();
  }, [form.watch, sendInvites.reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

            <div className="px-4 py-6 lg:px-6">
              <div className="flex flex-col gap-5">
                {form.watch("invites").map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={index} className="flex items-start gap-4">
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
                                type="email"
                                placeholder="user@example.com"
                                disabled={!inviteEnabled}
                                className="disabled:bg-muted"
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
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch("invites").length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-8 bg-background text-destructive-text disabled:cursor-not-allowed disabled:opacity-100"
                        onClick={() => {
                          const currentInvites = form.getValues("invites");
                          form.setValue(
                            "invites",
                            currentInvites.filter((_, i) => i !== index),
                          );
                        }}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
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
              >
                <PlusIcon className="size-4" />
                Add Another
              </Button>
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
      value={props.value}
      onValueChange={(v) => {
        props.onChange(v as TeamAccountRole);
      }}
    >
      <SelectTrigger
        className="capitalize disabled:bg-muted"
        disabled={props.disabled}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role} className="capitalize">
            {role.toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
