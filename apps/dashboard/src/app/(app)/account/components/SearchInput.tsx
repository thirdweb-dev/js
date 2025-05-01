import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function SearchInput(props: {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Input
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onValueChange(e.target.value)}
        className="bg-card pl-9"
      />
      <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
    </div>
  );
}
