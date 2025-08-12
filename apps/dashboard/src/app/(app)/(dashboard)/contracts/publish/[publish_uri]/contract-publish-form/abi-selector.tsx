import type { Abi } from "abitype";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AbiSelector({
  abi,
  value,
  defaultValue,
  onChange,
}: {
  abi: Abi;
  defaultValue: string;
  value: string;
  onChange: (fn: string) => void;
}) {
  const options = useMemo(() => {
    return abi
      .filter((f) => f.type === "function")
      .filter((f) => f.stateMutability !== "view")
      .map((f) => ({
        label: f.name,
        value: f.name,
      }));
  }, [abi]);

  return (
    <Select value={value} onValueChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger className="w-full bg-card">
        <SelectValue placeholder="Select function" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
