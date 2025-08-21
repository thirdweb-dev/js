import { Button } from "@workspace/ui/components/button";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import { ProjectAvatar } from "../avatar/project-avatar";
import { type ActionLink, LinkGroup } from "./header/link-group";

type Action =
  | ({
      label: string;
      href: string;
    } & (
      | {
          external: true;
          icon?: never;
        }
      | {
          icon?: React.ReactNode;
          external?: false;
        }
    ))
  | {
      component: React.ReactNode;
    };

function Action(props: { action: Action; variant?: "default" | "secondary" }) {
  const action = props.action;
  return "component" in action ? (
    action.component
  ) : (
    <Button asChild className="rounded-full" variant={props.variant}>
      <Link
        href={action.href}
        target={action.external ? "_blank" : undefined}
        rel={action.external ? "noopener noreferrer" : undefined}
        className="flex flex-row items-center gap-1.5"
      >
        {action.icon}
        {action.label}
        {action.external && <ArrowUpRightIcon className="size-4" />}
      </Link>
    </Button>
  );
}

export type ProjectPageHeaderProps = {
  client: ThirdwebClient;
  title: string;
  description?: string;
  imageUrl?: string | null;
  actions: {
    primary: Action;
    secondary?: Action;
  } | null;

  links?: ActionLink[];

  // TODO: add task card component
  task?: never;
};

export function ProjectPageHeader(props: ProjectPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 container py-5">
      {/* main row */}
      <div className="flex flex-row items-center justify-between">
        {/* left */}
        <div className="flex flex-col gap-2">
          {/* image */}
          {props.imageUrl !== undefined && (
            <ProjectAvatar
              className="size-14"
              client={props.client}
              src={props.imageUrl ?? undefined}
            />
          )}
          {/* title */}
          <div className="flex flex-col gap-1 max-w-xl">
            <h2 className="text-2xl font-medium line-clamp-1">{props.title}</h2>
            <p className="text-sm text-muted-foreground line-clamp-3 md:line-clamp-2">
              {props.description}
            </p>
          </div>
        </div>

        {/* right */}
        {/* TODO: add "current task" card component */}
      </div>

      {/* actions row */}
      {props.actions && (
        <div className="flex flex-row items-center justify-between">
          {/* left actions */}
          <div className="flex flex-row items-center gap-4">
            {props.actions.primary && <Action action={props.actions.primary} />}
            {props.actions.secondary && (
              <Action action={props.actions.secondary} variant="secondary" />
            )}
          </div>
          {/* right actions */}
          {props.links && props.links.length > 0 && (
            <LinkGroup links={props.links} />
          )}
        </div>
      )}
    </header>
  );
}
