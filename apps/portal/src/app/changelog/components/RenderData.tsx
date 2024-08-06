import { cn } from "../../../lib/utils";
import { formatDistance } from "date-fns";

export function RenderDate(props: { iso: string; className?: string }) {
	return (
		<time
			dateTime={props.iso}
			className={cn("text-sm font-medium text-f-300", props.className)}
		>
			{formatDistance(new Date(props.iso), new Date())} ago
		</time>
	);
}
