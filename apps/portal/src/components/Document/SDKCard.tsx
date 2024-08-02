import Link from "next/link";

export function SDKCard(props: {
	title: string;
	href: string;
	icon?: React.FC<{ className?: string }>;
}) {
	return (
		<Link
			href={props.href}
			className="flex items-center gap-4 rounded-lg border bg-b-800 p-4 transition-colors hover:border-accent-500 hover:bg-accent-900"
		>
			{props.icon && <props.icon className="size-8 shrink-0" />}
			<h3 className="text-lg font-semibold text-f-100">{props.title}</h3>
		</Link>
	);
}
