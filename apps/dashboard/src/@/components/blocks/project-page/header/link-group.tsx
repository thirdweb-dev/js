"use client";

import { Button } from "@workspace/ui/components/button";
import {
  BookTextIcon,
  BoxIcon,
  EllipsisVerticalIcon,
  NetworkIcon,
  SettingsIcon,
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
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

type LinkType = "api" | "docs" | "playground" | "webhooks" | "settings";

const linkTypeToLabel: Record<LinkType, string> = {
  api: "API Reference",
  docs: "Documentation",
  playground: "Playground",
  webhooks: "Webhooks",
  settings: "Settings",
};

const linkTypeToOrder: Record<LinkType, number> = {
  docs: 0,
  playground: 1,
  api: 3,
  webhooks: 4,
  settings: 5,
};

const linkTypeToIcon: Record<LinkType, React.ReactNode> = {
  api: <NetworkIcon className="size-4" />,
  docs: <BookTextIcon className="size-4" />,
  playground: <BoxIcon className="size-4" />,
  webhooks: <WebhookIcon className="size-4" />,
  settings: <SettingsIcon className="size-4" />,
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
  const isMobile = useIsMobile();
  const maxLinks = isMobile ? 1 : 2;
  const orderedLinks = useMemo(() => orderLinks(props.links), [props.links]);

  // case where we just render directly
  if (props.links.length <= maxLinks) {
    return (
      <div className="flex flex-row items-center gap-2">
        {orderedLinks.map((link) => {
          const isExternal = link.href.startsWith("http");
          return (
            <ToolTipLabel key={link.type} label={linkTypeToLabel[link.type]}>
              <Button
                asChild
                size="icon"
                variant="outline"
                className="rounded-full"
              >
                <Link
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="flex flex-row items-center gap-2"
                >
                  {linkTypeToIcon[link.type]}
                </Link>
              </Button>
            </ToolTipLabel>
          );
        })}
      </div>
    );
  }

  // case where we render a dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="gap-1 flex flex-col md:w-48">
        {orderedLinks.map((link) => {
          const isExternal = link.href.startsWith("http");
          return (
            <DropdownMenuItem
              key={link.type}
              asChild
              className="flex flex-row items-center gap-2 cursor-pointer py-2 text-muted-foreground hover:text-foreground"
            >
              <Link
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {linkTypeToIcon[link.type]}
                {linkTypeToLabel[link.type]}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
