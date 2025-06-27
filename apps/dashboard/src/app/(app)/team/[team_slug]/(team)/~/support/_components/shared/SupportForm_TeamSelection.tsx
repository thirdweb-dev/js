import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  teams: {
    name: string;
    id: string;
  }[];
  selectedTeamId: string | undefined;
  onChange: (teamId: string) => void;
};

export const SupportForm_TeamSelection = (props: Props) => {
  const { teams, selectedTeamId, onChange } = props;

  return (
    <div className="flex flex-col items-start gap-2">
      <Label className="relative" htmlFor="team">
        Select Team
        <span className="-top-1.5 -right-2 absolute text-destructive">•</span>
      </Label>

      <Select
        name="team"
        onValueChange={onChange}
        required
        value={selectedTeamId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose a team">
            {teams.find((t) => t.id === selectedTeamId)?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
