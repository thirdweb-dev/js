import Link from "next/link";

export function DocLink(props: {
  link: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <Link
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 whitespace-nowrap text-muted-foreground text-sm hover:text-foreground"
    >
      <props.icon className="size-4" />
      {props.label}
    </Link>
  );
}
