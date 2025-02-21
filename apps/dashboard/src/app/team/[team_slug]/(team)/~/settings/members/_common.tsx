"use client";

import type { TeamAccountRole } from "@/api/team-members";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

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
          placeholder={props.searchPlaceholder}
          className="bg-card pl-9"
          disabled={props.disabled}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
    date: "Date",
    "a-z": "Name (A-Z)",
    "z-a": "Name (Z-A)",
  };

  const sortByIds: MemberSortId[] = ["date", "a-z", "z-a"];

  return (
    <Select
      value={sortBy}
      onValueChange={(v) => {
        setSortBy(v as "date" | "a-z" | "z-a");
      }}
    >
      <SelectTrigger
        className="bg-card capitalize disabled:bg-muted lg:w-[150px]"
        disabled={props.disabled}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sortByIds.map((id) => (
          <SelectItem key={id} value={id} className="capitalize">
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
      value={role}
      onValueChange={(v) => {
        setRole(v as RoleFilterValue);
      }}
    >
      <SelectTrigger
        className="bg-card capitalize disabled:bg-muted lg:w-[150px]"
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
