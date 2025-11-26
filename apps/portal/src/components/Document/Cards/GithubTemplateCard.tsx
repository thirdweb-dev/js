import Link from "next/link";
import { GithubIcon } from "../GithubButtonLink";

export function GithubTemplateCard(props: {
  title: string;
  description?: string;
  href: string;
  tag?: string;
}) {
  return (
    <Link className="flex" href={props.href} target="_blank">
      <article className="group/article flex w-full items-center overflow-hidden rounded-lg border bg-card transition-colors duration-300 hover:border-active-border">
        <div className="flex w-full items-center gap-4 p-4">
          <GithubIcon className="size-5 shrink-0" />
          <div className="flex flex-col gap-1">
            <h3 className="font-medium text-base">{props.title}</h3>
            {props.description && (
              <p className="text-muted-foreground text-sm">
                {props.description}
              </p>
            )}
          </div>
          {props.tag && (
            <div className="ml-auto shrink-0 rounded-lg border bg-muted px-2 py-1 text-foreground text-xs transition-colors">
              {props.tag}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
