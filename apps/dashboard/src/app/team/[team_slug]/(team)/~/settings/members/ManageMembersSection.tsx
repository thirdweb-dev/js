"use client";

import type { Team } from "@/api/team";
import type { TeamAccountRole, TeamMember } from "@/api/team-members";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import { useMutation } from "@tanstack/react-query";
import { EllipsisIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
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

  const membersToShow = useMemo(() => {
    let value = props.members;

    if (searchTerm) {
      value = value.filter((m) =>
        m.account.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
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
  }, [role, props.members, sortBy, deletedMembersIds, searchTerm]);

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
        setRole={setRole}
        setSortBy={setSortBy}
        sortBy={sortBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Search Team Members"
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
                  key={member.accountId}
                  className="border-border border-b last:border-b-0"
                >
                  <MemberRow
                    member={member}
                    userHasEditPermission={props.userHasEditPermission}
                    client={props.client}
                    deleteMember={props.deleteMember}
                    onMemberDeleted={() => {
                      setDeletedMembersIds([
                        ...deletedMembersIds,
                        member.accountId,
                      ]);
                    }}
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
          src={props.member.account.image || ""}
          id={props.member.account.creatorWalletAddress}
          client={props.client}
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
            member={props.member}
            userHasEditPermission={props.userHasEditPermission}
            deleteMember={props.deleteMember}
            onMemberDeleted={props.onMemberDeleted}
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
            size="icon"
            variant="ghost"
            className="!h-auto !w-auto p-1.5"
            disabled={!props.userHasEditPermission}
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

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
                  success: "Member deleted successfully",
                  error: "Failed to delete member",
                });
                promise.then(() => {
                  setShowDeleteDialog(false);
                  props.onMemberDeleted();
                });
              }}
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
