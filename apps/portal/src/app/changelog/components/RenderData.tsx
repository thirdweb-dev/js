import { formatDate } from "date-fns";
import { cn } from "../../../lib/utils";

export function RenderDate(props: { iso: string; className?: string }) {
  return (
    <time className={cn("text-sm", props.className)} dateTime={props.iso}>
      {formatDate(new Date(props.iso), "MMM d, yyyy")}
    </time>
  );
}
