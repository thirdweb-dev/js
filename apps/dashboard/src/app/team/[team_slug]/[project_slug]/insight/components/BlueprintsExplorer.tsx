"use client";

import {} from "@/components/ui/dropdown-menu";
import {} from "@/components/ui/select";
import { Layers3 } from "lucide-react";
import Link from "next/link";

export type Blueprint = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export function BlueprintsExplorer(props: {
  blueprints: Blueprint[];
}) {
  const { blueprints } = props;
  return (
    <div className="container">
      {/* Blueprints */}
      {blueprints.length === 0 ? (
        <div className="flex h-[450px] items-center justify-center rounded-lg border border-border ">
          No blueprints found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blueprints.map((blueprint) => {
            return <BlueprintCard key={blueprint.id} blueprint={blueprint} />;
          })}
        </div>
      )}

      <div className="h-10" />
    </div>
  );
}

function BlueprintCard(props: {
  blueprint: Blueprint;
}) {
  const { blueprint } = props;
  return (
    <div
      key={blueprint.id}
      className="relative flex items-center gap-4 rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:bg-muted/70"
    >
      <Layers3 className="size-10" />

      <div>
        <Link
          className="group static before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-0"
          href={`https://portal.thirdweb.com/insight/blueprints#${blueprint.slug}`}
        >
          <h2 className="font-medium text-base">{blueprint.name}</h2>
        </Link>

        <p className="my-1 text-muted-foreground/70 text-xs">
          {blueprint.description}
        </p>
      </div>
    </div>
  );
}
