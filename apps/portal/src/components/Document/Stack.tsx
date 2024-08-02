import { cn } from "@/lib/utils";

export function Stack(props: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("my-6 flex flex-col gap-4", props.className)}>
			{props.children}
		</div>
	);
}
