"use client";

import { useMutation } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { EllipsisIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import type { Team } from "@/api/team/get-team";
import type { TeamAccountRole, TeamMember } from "@/api/team/team-members";
import { GradientAvatar } from "@/components/blocks/avatar/gradient-avatar";
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
import { Spinner } from "@/components/ui/Spinner";
import { FiltersSection, type MemberSortId } from "./_common";

type RoleFilterValue = "ALL ROLES" | TeamAccountRole;

export function ManageMembersSection(props: {
  team: Team;
  userHasEditPermission: boolean;
  members: TeamMember[];
  client: ThirdwebClient;
  deleteMember: (memberId: string) => Promise<void>;
}) {
  let topSection: React.ReactNode = null;

  const [searchTerm, setSearchTerm] = useState("");
  const [deletedMembersIds, setDeletedMembersIds] = useState<string[]>([]);
  const [role, setRole] = useState<RoleFilterValue>("ALL ROLES");
  const [sortBy, setSortBy] = useState<MemberSortId>("date");

  const membersIndex = useMemo(() => {
    return new Fuse(props.members, {
      keys: [
        { name: "account.name", weight: 2 },
        { name: "account.email", weight: 1 },
      ],
      threshold: 0.3,
    });
  }, [props.members]);

  const membersToShow = useMemo(() => {
    let value = props.members;

    if (searchTerm) {
      value = membersIndex.search(searchTerm).map((result) => result.item);
    }

    value = value.filter((m) => !deletedMembersIds.includes(m.accountId));

    if (role !== "ALL ROLES") {
      value = value.filter((m) => m.role === role);
    }

    switch (sortBy) {
      case "date":
        value = value.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "a-z":
        value = value.sort((a, b) =>
          a.account.name.localeCompare(b.account.name),
        );
        break;
      case "z-a":
        value = value.sort((a, b) =>
          b.account.name.localeCompare(a.account.name),
        );
        break;
    }

    return value;
  }, [
    role,
    props.members,
    sortBy,
    deletedMembersIds,
    searchTerm,
    membersIndex,
  ]);

  if (!props.userHasEditPermission) {
    topSection = (
      <div className="border-border border-b p-4">
        <p className="text-muted-foreground text-sm">
          You don't have permission to manage members
        </p>
      </div>
    );
  }

  return (
    <section>
      <FiltersSection
        // don't use membersToShow here
        disabled={props.members.length === 0}
        role={role}
        searchPlaceholder="Search Team Members"
        searchTerm={searchTerm}
        setRole={setRole}
        setSearchTerm={setSearchTerm}
        setSortBy={setSortBy}
        sortBy={sortBy}
      />

      <div className="h-3" />

      {/* Card */}
      <div className="rounded-lg border border-border bg-card">
        {/* Top section */}
        {topSection}

        {membersToShow.length > 0 && (
          <ul>
            {membersToShow.map((member) => {
              return (
                <li
                  className="border-border border-b last:border-b-0"
                  key={member.accountId}
                >
                  <MemberRow
                    client={props.client}
                    deleteMember={props.deleteMember}
                    member={member}
                    onMemberDeleted={() => {
                      setDeletedMembersIds([
                        ...deletedMembersIds,
                        member.accountId,
                      ]);
                    }}
                    userHasEditPermission={props.userHasEditPermission}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {membersToShow.length === 0 && (
          <div className="flex justify-center px-4 py-10">
            <p className="text-muted-foreground text-sm">No Members Found</p>
          </div>
        )}
      </div>
    </section>
  );
}

function MemberRow(props: {
  member: TeamMember;
  userHasEditPermission: boolean;
  client: ThirdwebClient;
  deleteMember: (memberId: string) => Promise<void>;
  onMemberDeleted: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-4">
      <div className="flex items-center gap-3 lg:gap-4">
        <GradientAvatar
          className="size-6 border lg:size-9"
          client={props.client}
          id={props.member.account.creatorWalletAddress}
          src={props.member.account.image || ""}
        />

        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-sm">
            {props.member.account.name || props.member.account.email}
          </p>

          {props.member.account.name && (
            <p className="text-muted-foreground text-xs lg:text-sm">
              {props.member.account.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <p className="text-muted-foreground text-xs capitalize lg:text-sm">
          {props.member.role.toLowerCase()}
        </p>

        {props.userHasEditPermission && (
          <ManageMemberButton
            deleteMember={props.deleteMember}
            member={props.member}
            onMemberDeleted={props.onMemberDeleted}
            userHasEditPermission={props.userHasEditPermission}
          />
        )}
      </div>
    </div>
  );
}

function ManageMemberButton(props: {
  member: TeamMember;
  userHasEditPermission: boolean;
  deleteMember: (memberId: string) => Promise<void>;
  onMemberDeleted: () => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => props.deleteMember(props.member.accountId),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="!h-auto !w-auto p-1.5"
            disabled={!props.userHasEditPermission}
            size="icon"
            variant="ghost"
          >
            <EllipsisIcon className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Remove Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="p-6">
            <DialogTitle className="text-xl">Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span
                className={
                  props.member.account.name
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              >
                {props.member.account.name || "this member"}
              </span>{" "}
              from the team?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 border-t bg-card p-6">
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() => {
                const promise = deleteMutation.mutateAsync();
                toast.promise(promise, {
                  error: "Failed to delete member",
                  success: "Member deleted successfully",
                });
                promise.then(() => {
                  setShowDeleteDialog(false);
                  props.onMemberDeleted();
                });
              }}
              type="button"
            >
              {deleteMutation.isPending && <Spinner className="size-4" />}
              Remove Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
