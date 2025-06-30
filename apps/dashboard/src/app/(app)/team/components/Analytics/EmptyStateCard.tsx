import { PlugIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyStateCard({
  metric,
  link,
  description,
}: {
  metric?: string;
  link?: string;
  description?: string;
}) {
  return (
    <Card className="container h-[300px] p-2 md:h-[400px]">
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center">
        <EmptyStateContent
          description={description}
          link={link}
          metric={metric}
        />
      </div>
    </Card>
  );
}

export function EmptyStateContent(props: {
  metric: string | undefined;
  description?: string;
  link?: string;
}) {
  const description =
    props.description ||
    (props.metric
      ? `Your app may not be configured to use ${props.metric}`
      : undefined);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 text-foreground">
      <div className="flex size-10 items-center justify-center rounded-full border bg-background">
        <PlugIcon className="size-5 text-muted-foreground" />
      </div>

      <div className="space-y-0.5">
        <div className="font-semibold text-lg">No data available</div>
        {description && (
          <div className="text-muted-foreground text-sm">{description}</div>
        )}
      </div>

      {props.link && (
        <Button
          asChild
          className="mt-2 rounded-full"
          size="sm"
          variant="default"
        >
          <Link
            className="text-sm"
            href={props.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            Configure {props.metric}
          </Link>
        </Button>
      )}
    </div>
  );
}
