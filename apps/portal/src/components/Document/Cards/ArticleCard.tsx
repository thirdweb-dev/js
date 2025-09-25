import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ArticleCard(props: {
  title: string;
  description: string;
  href: string;
}) {
  const isExternal = props.href.startsWith("http");
  return (
    <Link
      className="flex cursor-default bg-card"
      data-noindex
      href={props.href}
      target={isExternal ? "_blank" : undefined}
    >
      <article className="group/article w-full overflow-hidden rounded-lg border transition-colors hover:border-active-border">
        <div className="p-4">
          <h3 className="mb-1.5 font-semibold text-base">{props.title}</h3>
          <p className="font-medium text-muted-foreground text-sm">
            {props.description}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function ArticleIconCard(props: {
  title: string;
  description?: string;
  href: string;
  image?: StaticImport;
  icon?: React.FC<{ className?: string }>;
  className?: string;
}) {
  const isExternal = props.href.startsWith("http");
  return (
    <Link
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-card px-4 py-6 transition-colors hover:border-active-border",
        props.className,
      )}
      data-noindex
      href={props.href}
      target={isExternal ? "_blank" : undefined}
    >
      {props.icon && (
        <div className="shrink-0">
          <div className="rounded-full p-2.5 bg-background border">
            <props.icon className="size-3.5 text-muted-foreground" />
          </div>
        </div>
      )}
      {props.image && (
        <Image alt="" className="size-6 shrink-0" src={props.image} />
      )}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold text-base text-foreground leading-none">
          {props.title}
        </h3>
        {props.description && (
          <p className="text-muted-foreground text-sm">{props.description}</p>
        )}
      </div>
    </Link>
  );
}
