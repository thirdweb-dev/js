import Link from "next/link";

export function SDKCard(props: {
  title: string;
  href: string;
  icon?: React.FC<{ className?: string }>;
}) {
  return (
    <Link
      href={props.href}
      className="flex items-center gap-2 rounded-lg border bg-card p-4 transition-colors hover:border-active-border"
    >
      {props.icon && <props.icon className="size-6 shrink-0 text-foreground" />}
      <h3 className="font-semibold text-base text-foreground tracking-tight">
        {props.title}
      </h3>
    </Link>
  );
}
