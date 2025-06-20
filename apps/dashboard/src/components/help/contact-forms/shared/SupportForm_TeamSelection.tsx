import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MinimalTeam = {
  name: string;
  id: string;
};

type Props = {
  teams: MinimalTeam[];
  selectedTeamId: string | undefined;
  onChange: (teamId: string) => void;
};

export const SupportForm_TeamSelection = (props: Props) => {
  const selectedTeamName = props.teams.find(
    (t) => t.id === props.selectedTeamId,
  )?.name;

  const teamId = useId();

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <Label className="relative" htmlFor={teamId}>
          Select Team
          <span className="-top-1.5 -right-2 absolute text-destructive">•</span>
        </Label>

        <Select
          name="teamId"
          onValueChange={(selectedId) => {
            props.onChange(selectedId);
          }}
          value={props.selectedTeamId}
        >
          <SelectTrigger id={teamId}>
            <SelectValue placeholder="Select a Team">
              {selectedTeamName}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {props.teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
