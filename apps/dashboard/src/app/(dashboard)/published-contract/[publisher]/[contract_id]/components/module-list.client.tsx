"use client";

import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { moduleFromBase64 } from "../../../utils/module-base-64";

function useModules() {
  const modules = useSearchParams()?.getAll("module") || [];
  return useMemo(
    () => modules.map(moduleFromBase64).filter((m) => m !== null),
    [modules],
  );
}

export function ModuleList() {
  const modules = useModules();

  // if nothing, render nothing
  if (!modules.length) {
    return null;
  }
  // else render stuff
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {modules.map((m) => (
        <Badge
          key={`${m.publisher}/${m.moduleId}/${m.version}`}
          variant="default"
        >
          {m.displayName}
        </Badge>
      ))}
    </div>
  );
}
