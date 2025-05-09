"use client";

import type { Team } from "@/api/team";
import type { TeamInvite } from "@/api/team-invites";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BASE_URL } from "@/constants/env-utils";
import { useMutation } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { EllipsisIcon, MailIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import {
  FiltersSection,
  type MemberSortId,
  type RoleFilterValue,
} from "./_common";

export function ManageInvitesSection(props: {
  team: Team;
  userHasEditPermission: boolean;
  teamInvites: TeamInvite[];
  client: ThirdwebClient;
  deleteInvite: (inviteId: string) => Promise<void>;
}) {
  let topSection: React.ReactNode = null;

  const [searchTerm, setSearchTerm] = useState("");
  const [deletedInviteIds, setDeletedInviteIds] = useState<string[]>([]);
  const [role, setRole] = useState<RoleFilterValue>("ALL ROLES");
  const [sortBy, setSortBy] = useState<MemberSortId>("date");

  const invitesToShow = useMemo(() => {
    let value = props.teamInvites;

    if (searchTerm) {
      value = value.filter((inv) =>
        inv.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    value = value.filter((inv) => !deletedInviteIds.includes(inv.id));

    if (role !== "ALL ROLES") {
      value = value.filter((m) => m.role === role);
    }

    switch (sortBy) {
      case "date":
        value = value.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "a-z":
        value = value.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case "z-a":
        value = value.sort((a, b) => b.email.localeCompare(a.email));
        break;
    }

    return value;
  }, [role, props.teamInvites, sortBy, deletedInviteIds, searchTerm]);

  if (!props.userHasEditPermission) {
    topSection = (
      <div className="border-border border-b p-4">
        <p className="text-muted-foreground text-sm">
          You don't have permission to manage invites
        </p>
      </div>
    );
  }

  return (
    <section>
      <FiltersSection
        // don't use invitesToShow here
        disabled={props.teamInvites.length === 0}
        role={role}
        setRole={setRole}
        setSortBy={setSortBy}
        sortBy={sortBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Search Email"
      />

      <div className="h-3" />

      {/* Card */}
      <div className="rounded-lg border border-border bg-card">
        {/* Top section */}
        {topSection}

        {invitesToShow.length > 0 && (
          <ul>
            {invitesToShow.map((invite) => {
              return (
                <li
                  key={invite.id}
                  className="border-border border-b last:border-b-0"
                >
                  <InviteRow
                    teamSlug={props.team.slug}
                    invite={invite}
                    client={props.client}
                    userHasEditPermission={props.userHasEditPermission}
                    deleteInvite={props.deleteInvite}
                    onInviteDeleted={() => {
                      setDeletedInviteIds([...deletedInviteIds, invite.id]);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {invitesToShow.length === 0 && (
          <div className="flex justify-center px-4 py-20">
            <p className="text-muted-foreground text-sm">No Invites</p>
          </div>
        )}
      </div>
    </section>
  );
}

function InviteRow(props: {
  teamSlug: string;
  invite: TeamInvite;
  userHasEditPermission: boolean;
  client: ThirdwebClient;
  deleteInvite: (inviteId: string) => Promise<void>;
  onInviteDeleted: () => void;
}) {
  return (
    <div className="relative flex flex-col justify-between gap-3 px-4 py-4 lg:flex-row lg:items-center">
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Mail Icon */}
        <div className="hidden size-6 items-center justify-center rounded-full border bg-background lg:flex lg:size-9">
          <MailIcon className="size-3 text-muted-foreground lg:size-4" />
        </div>

        {/* Email + Timestamps */}
        <div>
          <p className="mb-2 font-semibold text-sm lg:mb-1">
            {props.invite.email}
          </p>
          <div className="flex flex-col gap-1 text-muted-foreground text-xs lg:flex-row lg:items-center lg:gap-2">
            <span>
              Invited on {formatDate(props.invite.createdAt, "MMM d, yyyy")}
            </span>
            <div className="hidden size-1 rounded-full bg-muted-foreground/50 lg:block" />
            <span>
              Invitation expires on{" "}
              {formatDate(props.invite.expiresAt, "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 lg:justify-start lg:gap-6">
        {/* Role */}
        <p className="text-muted-foreground text-xs capitalize lg:text-sm">
          {props.invite.role.toLowerCase()}
        </p>

        {/* Status */}
        <Badge
          className="absolute top-4 right-4 capitalize lg:static lg:px-3 lg:py-1.5"
          variant={
            props.invite.status === "pending"
              ? "outline"
              : props.invite.status === "accepted"
                ? "success"
                : "destructive"
          }
        >
          {props.invite.status}
        </Badge>

        {/* Options */}
        {props.userHasEditPermission && (
          <ManageInviteButton
            teamSlug={props.teamSlug}
            invite={props.invite}
            userHasEditPermission={props.userHasEditPermission}
            deleteInvite={props.deleteInvite}
            onInviteDeleted={props.onInviteDeleted}
          />
        )}
      </div>
    </div>
  );
}

function ManageInviteButton(props: {
  teamSlug: string;
  invite: TeamInvite;
  userHasEditPermission: boolean;
  deleteInvite: (inviteId: string) => Promise<void>;
  onInviteDeleted: () => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => props.deleteInvite(props.invite.id),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="!h-auto !w-auto p-1.5"
            disabled={!props.userHasEditPermission}
          >
            <EllipsisIcon className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {props.invite.status === "pending" && (
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(
                  `${BASE_URL}/join/team/${props.teamSlug}/${props.invite.id}`,
                );
                toast.success("Invite link copied to clipboard");
              }}
            >
              Copy Invite Link
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Invite
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="p-6">
            <DialogTitle className="text-xl">Delete Invite</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invite?
              <span className="mt-1 block text-muted-foreground">
                The invite link sent to {props.invite.email} will no longer work
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 border-t bg-card p-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() => {
                const promise = deleteMutation.mutateAsync();
                toast.promise(promise, {
                  success: "Invite deleted successfully",
                  error: "Failed to delete invite",
                });
                promise.then(() => {
                  setShowDeleteDialog(false);
                  props.onInviteDeleted();
                });
              }}
            >
              {deleteMutation.isPending && <Spinner className="size-4" />}
              Delete Invite
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
