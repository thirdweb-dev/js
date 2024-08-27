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
        className="pl-9 py-6 focus-visible:ring-0 rounded-none border-0 bg-transparent focus:shadow-none focus-visible:ring-transparent !ring-offset-transparent"
      />
      <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
