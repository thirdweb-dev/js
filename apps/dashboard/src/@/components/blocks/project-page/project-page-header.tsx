import { Button } from "@workspace/ui/components/button";
import { ArrowUpRightIcon, Settings2Icon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import { cn } from "@/lib/utils";
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

function Action(props: { action: Action; variant?: "default" | "outline" }) {
  const action = props.action;

  return "component" in action ? (
    action.component
  ) : (
    <Button
      asChild
      className={cn("rounded-full")}
      size="sm"
      variant={props.variant}
    >
      <Link
        href={action.href}
        target={action.external ? "_blank" : undefined}
        rel={action.external ? "noopener noreferrer" : undefined}
        className="flex flex-row items-center gap-2"
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
  description?: React.ReactNode;
  imageUrl?: string | null;
  icon: React.FC<{ className?: string }>;
  isProjectIcon?: boolean;
  actions: {
    primary?: Action;
    secondary?: Action;
  } | null;

  links?: ActionLink[];
  settings?: {
    href: string;
  };

  // TODO: add task card component
  task?: never;
};

export function ProjectPageHeader(props: ProjectPageHeaderProps) {
  return (
    <header className="container max-w-7xl py-6 relative">
      {/* top row */}
      <div className="flex justify-between items-start mb-4">
        {/* left - icon */}
        <div className="flex">
          {props.isProjectIcon ? (
            <props.icon />
          ) : (
            <div className="border rounded-full p-2.5 bg-card">
              <props.icon className="size-5 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* right - buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {props.links && props.links.length > 0 && (
              <LinkGroup links={props.links} />
            )}

            {props.settings && (
              <Link href={props.settings.href}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 bg-card"
                >
                  <Settings2Icon className="size-4 text-muted-foreground" />
                  Settings
                </Button>
              </Link>
            )}
          </div>

          {/* hide on mobile */}
          {props.actions && (
            <div className="hidden lg:flex items-center gap-3">
              {props.actions.secondary && (
                <Action action={props.actions.secondary} variant="outline" />
              )}

              {props.actions.primary && (
                <Action action={props.actions.primary} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* mid row */}
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            {props.title}
          </h2>
          {/* description */}
          <p className="text-sm text-muted-foreground text-pretty">
            {props.description}
          </p>
        </div>

        {/* bottom row - hidden on desktop */}
        {props.actions && (
          <div className="flex items-center gap-3 lg:hidden">
            {props.actions?.primary && (
              <Action action={props.actions.primary} />
            )}

            {props.actions?.secondary && (
              <Action action={props.actions.secondary} variant="outline" />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
