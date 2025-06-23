import Link from "next/link";
import { cn } from "../../lib/utils";

export function SDKCard(props: {
  title: string;
  href: string;
  isExternal?: boolean;
  icon?: React.FC<{ className?: string }>;
  iconClassName?: string;
}) {
  return (
    <Link
      className="flex items-center gap-2 rounded-lg border bg-card p-4 transition-colors hover:border-active-border"
      href={props.href}
      target={props.isExternal ? "_blank" : undefined}
    >
      {props.icon && (
        <props.icon
          className={cn("size-6 shrink-0 text-foreground", props.iconClassName)}
        />
      )}
      <h3 className="font-semibold text-base text-foreground tracking-tight">
        {props.title}
      </h3>
    </Link>
  );
}
