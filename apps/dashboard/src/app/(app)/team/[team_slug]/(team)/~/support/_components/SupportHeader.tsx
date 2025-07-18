"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SupportHeader(props: { teamSlug: string }) {
  const layoutSegment = useSelectedLayoutSegment();

  return (
    <div className="border-border border-b">
      <div className="container flex max-w-5xl flex-col items-start gap-3 py-9 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="font-semibold text-3xl tracking-tight mb-1">
            Support
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and view support cases for your projects
          </p>
        </div>
        {layoutSegment === null ? (
          <Button asChild className="rounded-full gap-2">
            <Link href={`/team/${props.teamSlug}/~/support/create`}>
              Create Case
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            className="rounded-full gap-2 bg-card"
            variant="outline"
          >
            <Link href={`/team/${props.teamSlug}/~/support`}>
              View All Cases
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
