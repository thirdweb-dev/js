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
      className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 transition-colors hover:border-active-border text-foreground/80 hover:text-foreground shadow-sm"
      href={props.href}
      target={props.isExternal ? "_blank" : undefined}
    >
      {props.icon && (
        <div className="rounded-full p-1.5 bg-background shrink-0 border">
          <props.icon className={cn("size-4", props.iconClassName)} />
        </div>
      )}
      <h3 className="text-foreground text-sm font-medium">{props.title}</h3>
    </Link>
  );
}
