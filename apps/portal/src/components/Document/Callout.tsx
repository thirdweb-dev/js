import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export function Callout(props: {
	children: React.ReactNode;
	variant: "danger" | "warning" | "info";
	disableIcon?: boolean;
	title?: string;
}) {
	return (
		<div
			role="alert"
			className={cn(
				"my-5 flex flex-col gap-3 rounded-md border p-4 ",
				props.variant === "danger" &&
					"bg-danger-900 border border-danger-500 [&_code]:border-none [&_code]:bg-danger-800 [&_button]:bg-danger-800 [&_button]:border-danger-500 [&_button_*]:text-danger-500",
				props.variant === "warning" &&
					"bg-warning-900 border border-warning-500 [&_code]:border-none [&_code]:bg-warning-800 [&_button]:bg-warning-800 [&_button]:border-warning-500 [&_button_*]:text-warning-500",
				props.variant === "info" &&
					"bg-accent-900 border border-accent-500 [&_code]:border-none [&_code]:bg-accent-800 [&_button]:bg-accent-800 [&_button]:border-accent-500 [&_button_*]:text-accent-500",
			)}
		>
			{props.title && (
				<div className="flex items-center gap-3">
					{!props.disableIcon && (
						<>
							{props.variant === "danger" && (
								<AlertTriangle className="size-6 shrink-0 text-danger-500" />
							)}

							{props.variant === "warning" && (
								<AlertCircle className="size-6 shrink-0 text-warning-500" />
							)}

							{props.variant === "info" && (
								<Info className="size-6 shrink-0 text-accent-500" />
							)}
						</>
					)}

					<h3 className="text-base font-semibold text-f-100">{props.title}</h3>
				</div>
			)}

			<div className="gap-2 [&_*:first-child]:mt-0 [&_*:last-child]:mb-0">
				{props.children}
			</div>
		</div>
	);
}
