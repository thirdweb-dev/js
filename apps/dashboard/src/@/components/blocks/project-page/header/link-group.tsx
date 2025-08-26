"use client";

import { Button } from "@workspace/ui/components/button";
import {
  BookTextIcon,
  BoxIcon,
  ChevronDownIcon,
  CodeIcon,
  WebhookIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LinkType = "api" | "docs" | "playground" | "webhooks";

const linkTypeToLabel: Record<LinkType, string> = {
  api: "API Reference",
  docs: "Documentation",
  playground: "Playground",
  webhooks: "Webhooks",
};

const linkTypeToOrder: Record<LinkType, number> = {
  docs: 0,
  playground: 1,
  api: 3,
  webhooks: 4,
};

const linkTypeToIcon: Record<LinkType, React.FC<{ className?: string }>> = {
  api: CodeIcon,
  docs: BookTextIcon,
  playground: BoxIcon,
  webhooks: WebhookIcon,
};

function orderLinks(links: ActionLink[]) {
  return links.slice().sort((a, b) => {
    const aIndex = linkTypeToOrder[a.type];
    const bIndex = linkTypeToOrder[b.type];
    return aIndex - bIndex;
  });
}

export type ActionLink = {
  type: LinkType;
  href: string;
};

export function LinkGroup(props: { links: ActionLink[] }) {
  const orderedLinks = useMemo(() => orderLinks(props.links), [props.links]);

  if (orderedLinks.length === 1 && orderedLinks[0]) {
    const link = orderedLinks[0];
    const Icon = linkTypeToIcon[link.type];
    return (
      <Link
        href={link.href}
        target={link.href.startsWith("http") ? "_blank" : undefined}
      >
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border gap-2 bg-card"
        >
          <Icon className="size-3.5 text-muted-foreground" />
          {linkTypeToLabel[link.type]}
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border gap-2 bg-card [&[data-state=open]>svg]:rotate-180"
        >
          Resources
          <ChevronDownIcon className="size-4 transition-transform duration-200 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="gap-1 flex flex-col w-48 rounded-xl"
        sideOffset={10}
      >
        {orderedLinks.map((link) => {
          const isExternal = link.href.startsWith("http");
          const Icon = linkTypeToIcon[link.type];
          return (
            <DropdownMenuItem
              key={link.type}
              asChild
              className="flex flex-row items-center gap-2 cursor-pointer py-1.5"
            >
              <Link
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                <Icon className="size-4 text-muted-foreground" />
                {linkTypeToLabel[link.type]}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
