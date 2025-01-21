import { cn } from "@/lib/utils";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";

export function ArticleCard(props: {
  title: string;
  description: string;
  href: string;
}) {
  const isExternal = props.href.startsWith("http");
  return (
    <Link
      href={props.href}
      className="flex cursor-default bg-card"
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
      href={props.href}
      className={cn(
        "flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-active-border",
        props.className,
      )}
      target={isExternal ? "_blank" : undefined}
    >
      {props.icon && (
        <props.icon className="size-6 shrink-0 text-muted-foreground" />
      )}
      {props.image && (
        <Image src={props.image} alt="" className="size-6 shrink-0" />
      )}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-semibold text-base text-foreground">
          {props.title}
        </h3>
        {props.description && (
          <p className="text-muted-foreground">{props.description}</p>
        )}
      </div>
    </Link>
  );
}
