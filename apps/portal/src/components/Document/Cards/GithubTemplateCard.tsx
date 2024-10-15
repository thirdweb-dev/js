import Link from "next/link";
import { GithubIcon } from "../GithubButtonLink";

export function GithubTemplateCard(props: {
  title: string;
  href: string;
  tag?: string;
}) {
  return (
    <Link href={props.href} target="_blank" className="flex cursor-default">
      <article className="group/article flex w-full items-center overflow-hidden rounded-lg border bg-b-800 transition-colors duration-300 hover:border-accent-500 hover:bg-accent-900">
        <div className="flex w-full items-center gap-4 p-4">
          <GithubIcon className="size-6 shrink-0" />
          <h3 className="font-medium text-base">{props.title}</h3>
          {props.tag && (
            <div className="ml-auto shrink-0 rounded-lg border bg-b-700 px-2 py-1 text-f-200 text-xs transition-colors">
              {props.tag}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
