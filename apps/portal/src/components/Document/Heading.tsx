import { cn } from "@/lib/utils";
import { Anchor } from "../ui/Anchor";

export function Heading(props: {
	children: React.ReactNode;
	id: string;
	level: number;
	className?: string;
	anchorClassName?: string;
	noIndex?: boolean;
}) {
	switch (props.level) {
		case 1: {
			return (
				<h1
					className={cn(
						"mb-7 text-3xl md:text-4xl font-bold tracking-tight text-f-100 break-words",
						props.className,
					)}
					data-noindex={props.noIndex}
				>
					{props.children}
				</h1>
			);
		}

		case 2: {
			return (
				<Anchor
					id={props.id}
					className={cn("mt-10 mb-3", props.anchorClassName)}
					data-noindex={props.noIndex}
				>
					<h2
						className={cn(
							"text-2xl md:text-3xl font-semibold tracking-tight text-f-100 break-words",
							props.className,
						)}
					>
						{props.children}
					</h2>
				</Anchor>
			);
		}

		case 3: {
			return (
				<Anchor
					id={props.id}
					className={cn("mt-10 mb-3", props.anchorClassName)}
					data-noindex={props.noIndex}
				>
					<h3
						className={cn(
							"text-xl md:text-2xl font-semibold text-f-200 break-words",
							props.className,
						)}
					>
						{props.children}
					</h3>
				</Anchor>
			);
		}

		case 4: {
			return (
				<Anchor
					id={props.id}
					className={cn("mt-10 mb-3", props.anchorClassName)}
					data-noindex={props.noIndex}
				>
					<h4
						className={cn(
							"text-lg md:text-xl font-semibold text-f-200 break-words",
							props.className,
						)}
					>
						{props.children}
					</h4>
				</Anchor>
			);
		}

		case 5: {
			return (
				<Anchor
					id={props.id}
					className={cn("mt-10 mb-3", props.anchorClassName)}
					data-noindex={props.noIndex}
				>
					<h5
						className={cn(
							"text-lg font-semibold text-f-200 break-words",
							props.className,
						)}
					>
						{props.children}
					</h5>
				</Anchor>
			);
		}

		default: {
			return (
				<Anchor
					id={props.id}
					className={cn("mt-10 mb-3", props.anchorClassName)}
					data-noindex={props.noIndex}
				>
					<h6
						className={cn(
							"text-lg font-semibold text-f-200 break-words",
							props.className,
						)}
					>
						{props.children}
					</h6>
				</Anchor>
			);
		}
	}
}
