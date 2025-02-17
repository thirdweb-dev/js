"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { acceptInvite } from "../../../../../../@/actions/acceptInvite";
import type { Team } from "../../../../../../@/api/team";

export function AcceptInviteCard(props: {
  team: Team;
  inviteId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accept Invite</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          You have been invited to join the team{" "}
          <strong>{props.team.name}</strong>. Please click the button below to
          accept the invite.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoading}
          onClick={() => {
            setIsLoading(true);
            toast.promise(
              acceptInvite({
                inviteId: props.inviteId,
                teamId: props.team.id,
              }),
              {
                loading: "Accepting invite...",
                success: "Invite accepted",
                error: (e) => {
                  if (e instanceof Error && e.message) {
                    return e.message;
                  }
                  return "Failed to accept invite";
                },
                finally: () => {
                  setIsLoading(false);
                },
              },
            );
          }}
        >
          {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
          Accept Invite
        </Button>
      </CardFooter>
    </Card>
  );
}
