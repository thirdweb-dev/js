import Image from "next/image";
import Link from "next/link";

export function ConnectCard(props: {
  title: string;
  href: string;
  iconUrl: string;
  isExternal?: boolean;
}) {
  return (
    <Link
      className="flex cursor-default"
      href={props.href}
      target={props.isExternal ? "_blank" : undefined}
    >
      <article className="group/article flex w-full items-center overflow-hidden rounded-lg border bg-card transition-colors hover:border-active-border">
        <div className="flex w-full items-center gap-4 p-4">
          <Image alt="" height={40} src={props.iconUrl} width={40} />
          <h3 className="font-medium text-base">{props.title}</h3>
        </div>
      </article>
    </Link>
  );
}
