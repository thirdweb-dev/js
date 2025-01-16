import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlugIcon } from "lucide-react";
import Link from "next/link";

export function EmptyStateCard({
  metric,
  link,
}: { metric: string; link?: string }) {
  return (
    <Card className="container h-[300px] p-2 md:h-[400px]">
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border text-center">
        <div className="flex size-8 items-center justify-center rounded-md border bg-card text-muted-foreground">
          <PlugIcon className="size-4" />
        </div>
        <div className="font-semibold text-lg">No data available</div>
        <div className="text-muted-foreground text-sm">
          Your app may not be configured to use {metric}.
        </div>
        {link && (
          <Button asChild variant="primary" size="sm" className="mt-4">
            <Link href={link} target="_blank" className="text-sm">
              Configure {metric}
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
