import Link from "next/link";

export function DocLink(props: {
  link: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <Link
      className="flex items-center gap-2 whitespace-nowrap text-muted-foreground text-sm hover:text-foreground"
      href={props.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      <props.icon className="size-4" />
      {props.label}
    </Link>
  );
}
