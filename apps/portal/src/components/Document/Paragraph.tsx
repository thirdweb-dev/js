import { cn } from "@/lib/utils";

export function Paragraph(props: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<p
			className={cn(
				"text-base leading-relaxed text-f-200 mb-3",
				props.className,
			)}
		>
			{props.children}
		</p>
	);
}
