import { PlugIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyStateCard({
  metric,
  link,
  description,
}: {
  metric: string;
  link?: string;
  description?: string;
}) {
  return (
    <Card className="container h-[300px] p-2 md:h-[400px]">
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border text-center">
        <EmptyStateContent
          description={description}
          link={link}
          metric={metric}
        />
      </div>
    </Card>
  );
}

export function EmptyStateContent({
  metric,
  description,
  link,
}: {
  metric: string;
  description?: string;
  link?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 text-foreground">
      <div className="flex size-8 items-center justify-center rounded-md border bg-card">
        <PlugIcon className="size-4" />
      </div>
      <div className="font-semibold text-lg">No data available</div>
      <div className="text-muted-foreground text-sm">
        {description ?? `Your app may not be configured to use ${metric}.`}
      </div>
      {link && (
        <Button asChild className="mt-4" size="sm" variant="primary">
          <Link
            className="text-sm"
            href={link}
            rel="noopener noreferrer"
            target="_blank"
          >
            Configure {metric}
          </Link>
        </Button>
      )}
    </div>
  );
}
