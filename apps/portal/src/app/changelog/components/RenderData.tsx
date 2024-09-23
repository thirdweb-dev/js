import { formatDistance } from "date-fns";
import { cn } from "../../../lib/utils";

export function RenderDate(props: { iso: string; className?: string }) {
  return (
    <time
      dateTime={props.iso}
      className={cn("font-medium text-f-300 text-sm", props.className)}
    >
      {formatDistance(new Date(props.iso), new Date())} ago
    </time>
  );
}
