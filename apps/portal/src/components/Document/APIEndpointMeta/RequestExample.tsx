"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function RequestExample(props: {
  codeExamples: Array<{
    label: string;
    code: React.ReactElement;
  }>;
  method: string;
  endpointUrl: string;
}) {
  const [selectedExample, setSelectedExample] = useState(props.codeExamples[0]);

  return (
    <div>
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <Badge className="bg-inverted text-inverted-foreground">
            {props.method}
          </Badge>
          <span className="truncate font-mono text-sm">
            {props.endpointUrl}
          </span>
        </div>
        <Select
          value={selectedExample?.label}
          onValueChange={(value: string) => {
            setSelectedExample(
              props.codeExamples.find((example) => example.label === value),
            );
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {props.codeExamples.map((example) => (
              <SelectItem key={example.label} value={example.label}>
                {example.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>{selectedExample?.code}</div>
    </div>
  );
}
