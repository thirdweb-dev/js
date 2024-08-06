import { cn } from "@/lib/utils";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";

export function ArticleCard(props: {
	title: string;
	description: string;
	href: string;
}) {
	const isExternal = props.href.startsWith("http");
	return (
		<Link
			href={props.href}
			className="flex cursor-default bg-b-800"
			target={isExternal ? "_blank" : undefined}
		>
			<article className="group/article w-full overflow-hidden rounded-lg border transition-colors duration-300 hover:border-accent-500 hover:bg-accent-900">
				<div className="p-4">
					<h3 className="mb-1.5 text-base font-semibold">{props.title}</h3>
					<p className="text-sm font-medium text-f-300">{props.description}</p>
				</div>
			</article>
		</Link>
	);
}

export function ArticleIconCard(props: {
	title: string;
	description?: string;
	href: string;
	image?: StaticImport;
	icon?: React.FC<{ className?: string }>;
	className?: string;
}) {
	const isExternal = props.href.startsWith("http");
	return (
		<Link
			href={props.href}
			className={cn(
				"flex items-center gap-4 rounded-lg border bg-b-800 p-4 transition-colors hover:border-accent-500 hover:bg-accent-900",
				props.className,
			)}
			target={isExternal ? "_blank" : undefined}
		>
			{props.icon && <props.icon className="size-8 shrink-0 text-accent-500" />}
			{props.image && (
				<Image src={props.image} alt={""} className="size-8 shrink-0" />
			)}
			<div className="flex flex-col gap-1">
				<h3 className="text-base font-semibold text-f-100 lg:text-lg">
					{props.title}
				</h3>
				{props.description && <p className="text-f-300">{props.description}</p>}
			</div>
		</Link>
	);
}
