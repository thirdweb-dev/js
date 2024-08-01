import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../../../../../@/components/ui/button";
import { NavLink } from "../client/nav-link.client";

export type SidebarContentProps = {
  slug: string;
};

export function SidebarContent(props: SidebarContentProps) {
  return (
    <>
      <Button
        size="sm"
        className="gap-1.5 w-full justify-start text-secondary-foreground mb-2"
        variant="ghost"
        asChild
      >
        <Link href="/chainlist">
          <ArrowLeftIcon className="size-4" />
          <span>Back to Chainlist</span>
        </Link>
      </Button>

      <Button
        size="sm"
        className="gap-1.5 w-full justify-start text-secondary-foreground"
        variant="ghost"
        asChild
      >
        <NavLink
          href={`/${props.slug}`}
          activeClassName="bg-accent text-accent-foreground"
        >
          Overview
        </NavLink>
      </Button>

      <Button
        size="sm"
        className="gap-1.5 w-full justify-start text-secondary-foreground"
        variant="ghost"
        asChild
      >
        <NavLink
          href={`/${props.slug}/popular`}
          activeClassName="bg-accent text-accent-foreground"
        >
          Popular Contracts
        </NavLink>
      </Button>
    </>
  );
}
