import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlugIcon } from "lucide-react";
import Link from "next/link";

export function EmptyStateCard({
  metric,
  link,
  description,
}: { metric: string; link?: string; description?: string }) {
  return (
    <Card className="container h-[300px] p-2 md:h-[400px]">
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border text-center">
        <EmptyStateContent
          metric={metric}
          link={link}
          description={description}
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
    <div className="flex flex-col items-center justify-center w-full gap-2 text-foreground">
      <div className="flex size-8 items-center justify-center rounded-md border bg-card">
        <PlugIcon className="size-4" />
      </div>
      <div className="font-semibold text-lg">No data available</div>
      <div className="text-muted-foreground text-sm">
        {description ?? `Your app may not be configured to use ${metric}.`}
      </div>
      {link && (
        <Button asChild variant="primary" size="sm" className="mt-4">
          <Link href={link} target="_blank" className="text-sm">
            Configure {metric}
          </Link>
        </Button>
      )}
    </div>
  );
}
