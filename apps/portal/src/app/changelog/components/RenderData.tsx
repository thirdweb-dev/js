import { formatDistance } from "date-fns";
import { cn } from "../../../lib/utils";

export function RenderDate(props: { iso: string; className?: string }) {
  return (
    <time
      className={cn(
        "font-medium text-muted-foreground text-sm",
        props.className,
      )}
      dateTime={props.iso}
    >
      {formatDistance(new Date(props.iso), new Date())} ago
    </time>
  );
}
