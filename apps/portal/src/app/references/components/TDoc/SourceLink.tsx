import Link from "next/link";

export function SourceLinkTypeDoc(props: { href: string }) {
  return (
    <div className="mb-6" data-noindex>
      <Link
        href={props.href}
        className="text-muted-foreground text-sm hover:text-foreground"
        target="_blank"
      >
        <span className="text-muted-foreground"> Defined in </span>
        {props.href.split("/packages/")[1]}
      </Link>
    </div>
  );
}
