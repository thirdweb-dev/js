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
      className="flex items-center gap-2 rounded-lg border bg-card p-2 px-4 transition-colors hover:border-active-border text-foreground/80 hover:text-foreground shadow-sm"
      href={props.href}
      target={props.isExternal ? "_blank" : undefined}
    >
      {props.icon && (
        <props.icon className={cn("size-4 shrink-0", props.iconClassName)} />
      )}
      <h3 className="font-semibold text-sm tracking-tight">{props.title}</h3>
    </Link>
  );
}
