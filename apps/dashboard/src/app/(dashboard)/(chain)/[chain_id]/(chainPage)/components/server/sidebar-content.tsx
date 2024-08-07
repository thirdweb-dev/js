import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import type { ChainMetadata } from "thirdweb/chains";
import { NavLink } from "../client/nav-link.client";

export type SidebarContentProps = {
  chain: ChainMetadata;
};

export function SidebarContent(props: SidebarContentProps) {
  return (
    <div className="p-4 md:pt-8 sticky top-0">
      {/* Desktop only */}
      <div className="lg:flex items-center gap-1.5 mb-5 hidden flex-wrap">
        <Link
          href="/chainlist"
          className="text-secondary-foreground hover:text-foreground text-sm"
        >
          Chainlist
        </Link>
        <span className="text-secondary-foreground text-sm"> / </span>
        <Link href={`/${props.chain.slug}`} className="text-foreground text-sm">
          {props.chain.name.replace("Mainnet", "")}
        </Link>
      </div>

      <div className="flex flex-col gap-2 lg:gap-4 lg:border-l-2 lg:pl-1">
        <SidebarNavLink href={`/${props.chain.slug}`} label="Overview" />
        <SidebarNavLink
          href={`/${props.chain.slug}/popular`}
          label="Popular Contracts"
        />
      </div>

      {/* mobile obly */}
      <div className="lg:hidden">
        <Separator className="mt-10 mb-4" />
        <SidebarNavLink
          href="/chainlist"
          label={
            <>
              <ArrowLeftIcon className="size-4" />
              <span className="text-secondary-foreground">View all chains</span>
            </>
          }
        />
      </div>
    </div>
  );
}

function SidebarNavLink(props: {
  href: string;
  label: React.ReactNode;
}) {
  return (
    <Button size="sm" variant="ghost" asChild>
      <NavLink
        href={props.href}
        className="!text-left justify-start flex gap-2 h-auto py-3.5 lg:text-secondary-foreground before:absolute before:h-full relative before:w-[2px] before:-left-1.5 lg:py-0 lg:h-auto lg:hover:bg-transparent"
        activeClassName="bg-accent lg:text-foreground lg:bg-transparent lg:before:bg-link-foreground "
      >
        {props.label}
      </NavLink>
    </Button>
  );
}
