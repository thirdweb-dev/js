import { getMembers } from "@/api/team-members";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlusIcon } from "lucide-react";

export default async function TeamMembersPage(props: {
  params: { team_slug: string };
}) {
  const members = await getMembers(props.params.team_slug);

  return (
    <>
      <div className="py-8 bg-card border-b">
        <div className="container flex flex-row justify-between items-center">
          <h2 className="font-medium text-3xl tracking-tight">Members</h2>
          <Button disabled className="gap-2">
            <UserPlusIcon className="size-4 shrink-0" />
            Invite
            <Badge className="ml-auto" variant="secondary">
              Soon{"™️"}
            </Badge>
          </Button>
        </div>
      </div>
      <div className="container py-6">
        <Card>
          <ul>
            {members.map((member) => (
              <li
                className="flex flex-row items-center flex-1 gap-4 border-t border-b first-of-type:border-t-0 last-of-type:border-b-0 p-4"
                key={member.accountId}
              >
                <Checkbox disabled />
                <div className="flex-grow text-sm">{member.account.email}</div>
                <span className="text-secondary-foreground text-sm font-medium capitalize">
                  {member.role.toLowerCase()}
                </span>
                <Button size="sm" variant="outline" disabled>
                  Manage Access
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
