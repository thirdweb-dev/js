import Link from "next/link";

export function FeatureCard(props: {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  href: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 hover:border-active-border relative">
      <div className="flex mb-4">
        <div className="p-2 rounded-full border bg-background">
          <props.icon className="size-4 text-muted-foreground" />
        </div>
      </div>
      <h3 className="font-semibold mb-0.5 text-lg tracking-tight">
        <Link className="before:absolute before:inset-0" href={props.href}>
          {props.title}
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground text-pretty">
        {props.description}
      </p>
    </div>
  );
}
