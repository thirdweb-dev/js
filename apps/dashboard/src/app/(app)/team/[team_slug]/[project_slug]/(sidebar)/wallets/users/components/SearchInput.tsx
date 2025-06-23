"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput(props: {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Input
        className="bg-card pl-9"
        onChange={(e) => props.onValueChange(e.target.value)}
        placeholder={props.placeholder}
        value={props.value}
      />
      <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
    </div>
  );
}
