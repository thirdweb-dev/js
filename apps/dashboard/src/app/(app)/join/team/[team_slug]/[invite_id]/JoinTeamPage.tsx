"use client";

import { useMutation } from "@tanstack/react-query";
import { CheckIcon, UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { acceptInvite } from "@/actions/team/acceptInvite";
import type { Team } from "@/api/team/get-team";
import { ToggleThemeButton } from "@/components/blocks/color-mode-toggle";
import { DotsBackgroundPattern } from "@/components/ui/background-patterns";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { ThirdwebMiniLogo } from "../../../../components/ThirdwebMiniLogo";

export function JoinTeamPage(props: { team: Team; inviteId: string }) {
  const router = useDashboardRouter();
  return (
    <JoinTeamPageUI
      invite={async () => {
        const res = await acceptInvite({
          inviteId: props.inviteId,
          teamId: props.team.id,
        });

        if (!res.ok) {
          console.error(res.errorMessage);
          throw new Error(res.errorMessage);
        }

        router.replace(`/team/${props.team.slug}`);
      }}
      teamName={props.team.name}
    />
  );
}

export function JoinTeamPageUI(props: {
  teamName: string;
  invite: () => Promise<void>;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <Header />

      <div className="container flex grow flex-col items-center justify-center ">
        <div className="z-10">
          <AcceptInviteCardUI invite={props.invite} teamName={props.teamName} />
        </div>
      </div>

      <DotsBackgroundPattern />
    </div>
  );
}

function Header() {
  return (
    <div className="border-b bg-background">
      <header className="container flex w-full flex-row items-center justify-between px-6 py-4">
        <div className="flex shrink-0 items-center gap-3">
          <ThirdwebMiniLogo className="size-7 md:size-8" />
          <span className="font-medium text-foreground text-xl tracking-tight">
            thirdweb
          </span>
        </div>

        <ToggleThemeButton />
      </header>
    </div>
  );
}

function AcceptInviteCardUI(props: {
  teamName: string;
  invite: () => Promise<void>;
}) {
  const invite = useMutation({
    mutationFn: props.invite,
  });
  return (
    <div className="w-full rounded-xl border bg-card shadow-2xl lg:w-[600px]">
      <div className="p-4 lg:p-6">
        <div className="mb-5 flex size-12 items-center justify-center rounded-full border bg-background">
          <UsersIcon className="size-5 text-muted-foreground" />
        </div>

        <h1 className="mb-3 font-semibold text-2xl tracking-tight">
          Join your team on thirdweb
        </h1>
        <p className="mb-1.5 font-medium text-muted-foreground">
          You have been invited to join team{" "}
          <em className="text-foreground not-italic">{props.teamName}</em>{" "}
        </p>

        <p className="text-muted-foreground">
          Accepting this invite will add you to the team and give you access to
          the team&apos;s resources
        </p>
      </div>
      <div className="flex justify-end border-t p-4 lg:p-6">
        <Button
          className="gap-2"
          disabled={invite.isPending}
          onClick={() => {
            const promise = invite.mutateAsync();
            toast.promise(promise, {
              error: (e) => {
                if (e instanceof Error && e.message) {
                  return e.message;
                }
                return "Failed to accept invite";
              },
              success: "Invite accepted",
            });
          }}
        >
          {invite.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <CheckIcon className="size-4" />
          )}
          Accept Invite
        </Button>
      </div>
    </div>
  );
}
