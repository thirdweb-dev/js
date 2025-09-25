import {
  BrainIcon,
  type LucideIcon,
  ScrollTextIcon,
  VideoIcon,
} from "lucide-react";
import { Feedback } from "../others/Feedback";
import type { SidebarLink } from "../others/Sidebar";
import { Subscribe } from "../others/Subscribe";
import { DocLink } from ".";
import { AutoEditPageButton } from "./AutoEditPageButton";
import { AutoNextPageButton } from "./AutoNextPageButton";

export function PageFooter(props: {
  editPageButton?: true;
  sidebarLinks?: SidebarLink[];
}) {
  return (
    <footer className="flex flex-col border-t border-dashed" data-noindex>
      <div className="flex gap-4 justify-end items-center py-6">
        {props.sidebarLinks && (
          <AutoNextPageButton sidebarLinks={props.sidebarLinks} />
        )}
      </div>
      <div className="border-t py-2 border-dashed flex justify-between items-center">
        {props.editPageButton && <AutoEditPageButton />}
        <Feedback />
      </div>
      <div className="flex flex-col justify-between gap-7 md:flex-row border-t py-6 border-dashed">
        <Links />
        <Subscribe />
      </div>
    </footer>
  );
}

function Links() {
  return (
    <ul className="flex flex-col gap-2">
      <FooterLinkItem
        href="https://www.youtube.com/@thirdweb_"
        icon={VideoIcon}
        label="Video tutorials"
        prefix="Watch our"
      />

      <FooterLinkItem
        href="/changelog"
        icon={ScrollTextIcon}
        label="Changelog"
        prefix="View our"
      />

      <FooterLinkItem
        href="/llms-full.txt"
        icon={BrainIcon}
        label="View llms.txt"
        prefix="Using AI?"
      />
    </ul>
  );
}

function FooterLinkItem(props: {
  label: string;
  href: string;
  prefix: string;
  icon: LucideIcon;
}) {
  return (
    <li className="flex items-center gap-2 text-muted-foreground">
      <div className="flex items-center gap-2 font-medium">
        <props.icon className="size-4" />
        <span className="text-sm">{props.prefix}</span>
      </div>

      <DocLink href={props.href} className="text-sm">
        {props.label}
      </DocLink>
    </li>
  );
}
