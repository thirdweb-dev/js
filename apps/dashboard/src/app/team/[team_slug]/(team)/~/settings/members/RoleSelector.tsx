import type { TeamAccountRole } from "@/api/team-members";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function RoleSelector(props: {
  disabled?: boolean;
}) {
  const roles: TeamAccountRole[] = ["OWNER", "MEMBER"];
  const [role, setRole] = useState<TeamAccountRole>("MEMBER");

  return (
    <Select
      value={role}
      onValueChange={(v) => {
        setRole(v as TeamAccountRole);
      }}
    >
      <SelectTrigger
        className="capitalize disabled:bg-muted w-[150px]"
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
