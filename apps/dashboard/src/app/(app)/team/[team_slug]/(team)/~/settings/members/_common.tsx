"use client";

import { SearchIcon } from "lucide-react";
import type { TeamAccountRole } from "@/api/team/team-members";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type RoleFilterValue = "ALL ROLES" | TeamAccountRole;
export type MemberSortId = "date" | "a-z" | "z-a";

export function FiltersSection(props: {
  disabled: boolean;
  role: RoleFilterValue;
  setRole: (role: RoleFilterValue) => void;
  setSortBy: (sortBy: MemberSortId) => void;
  sortBy: MemberSortId;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  searchPlaceholder: string;
}) {
  const { role, setRole, setSortBy, sortBy, searchTerm, setSearchTerm } = props;
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search  */}
      <div className="relative grow">
        <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 transform text-muted-foreground" />
        <Input
          className="bg-card pl-9"
          disabled={props.disabled}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={props.searchPlaceholder}
          value={searchTerm}
        />
      </div>

      <div className="grid grid-cols-2 items-center gap-3 lg:flex">
        <RoleSelector disabled={props.disabled} role={role} setRole={setRole} />
        <SortMembersBy
          disabled={props.disabled}
          setSortBy={setSortBy}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}

function SortMembersBy(props: {
  disabled?: boolean;
  setSortBy: (sortBy: MemberSortId) => void;
  sortBy: MemberSortId;
}) {
  const { sortBy, setSortBy } = props;
  const valueToLabel: Record<MemberSortId, string> = {
    "a-z": "Name (A-Z)",
    date: "Date",
    "z-a": "Name (Z-A)",
  };

  const sortByIds: MemberSortId[] = ["date", "a-z", "z-a"];

  return (
    <Select
      onValueChange={(v) => {
        setSortBy(v as "date" | "a-z" | "z-a");
      }}
      value={sortBy}
    >
      <SelectTrigger
        className="bg-card capitalize disabled:bg-muted lg:w-[150px]"
        disabled={props.disabled}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sortByIds.map((id) => (
          <SelectItem className="capitalize" key={id} value={id}>
            {valueToLabel[id]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RoleSelector(props: {
  disabled?: boolean;
  role: RoleFilterValue;
  setRole: (role: RoleFilterValue) => void;
}) {
  const { role, setRole } = props;
  const roles: RoleFilterValue[] = ["OWNER", "MEMBER", "ALL ROLES"];

  return (
    <Select
      onValueChange={(v) => {
        setRole(v as RoleFilterValue);
      }}
      value={role}
    >
      <SelectTrigger
        className="bg-card capitalize disabled:bg-muted lg:w-[150px]"
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
