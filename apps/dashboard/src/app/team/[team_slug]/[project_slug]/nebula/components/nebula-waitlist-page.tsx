import { joinTeamWaitlist } from "@/actions/joinWaitlist";
import { type Team, getTeamNebulaWaitList } from "@/api/team";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NebulaWaitListPageUI } from "./nebula-waitlist-page-ui.client";

export async function NebulaWaitListPage(props: {
  team: Team;
  className?: string;
  hideHeader?: boolean;
}) {
  const nebulaWaitList = await getTeamNebulaWaitList(props.team.slug);

  // this should never happen
  if (!nebulaWaitList) {
    return (
      <UnexpectedErrorPage message="Failed to get Nebula waitlist status for your team" />
    );
  }

  // if not already on the waitlist, join the waitlist
  if (!nebulaWaitList.onWaitlist) {
    const res = await joinTeamWaitlist({
      scope: "nebula",
      teamSlug: props.team.slug,
    }).catch(() => null);

    // this should never happen
    if (!res?.success) {
      return (
        <UnexpectedErrorPage message="Failed to join Nebula waitlist. Please try again later" />
      );
    }
  }

  return (
    <NebulaWaitListPageUI
      teamId={props.team.id}
      className={props.className}
      hideHeader={props.hideHeader}
    />
  );
}

function UnexpectedErrorPage(props: {
  message: string;
}) {
  return (
    <div className="container flex grow flex-col py-10">
      <div className="flex min-h-[300px] grow flex-col items-center justify-center rounded-lg border">
        <div className="flex flex-col items-center gap-4">
          <span className="text-destructive-text">{props.message}</span>
          <Button asChild variant="outline">
            <Link href="/support">Get Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
