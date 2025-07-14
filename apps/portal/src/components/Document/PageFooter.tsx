import {
  BadgeHelpIcon,
  BrainIcon,
  type LucideIcon,
  ScrollTextIcon,
  VideoIcon,
} from "lucide-react";
import { Feedback } from "../others/Feedback";
import { Subscribe } from "../others/Subscribe";
import { DocLink } from ".";
import { AutoEditPageButton } from "./AutoEditPageButton";
import { AutoNextPageButton } from "./AutoNextPageButton";
import type { SidebarLink } from "../others/Sidebar";

export function PageFooter(props: {
  editPageButton?: true;
  sidebarLinks?: SidebarLink[];
}) {
  return (
    <footer className="flex flex-col gap-7 pb-20" data-noindex>
      <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
        <div className="flex gap-4">
          {props.editPageButton && <AutoEditPageButton />}
          {props.sidebarLinks && (
            <AutoNextPageButton sidebarLinks={props.sidebarLinks} />
          )}
        </div>
        <Feedback />
      </div>
      <div className="h-1 border-t" />
      <div className="flex flex-col justify-between gap-7 md:flex-row">
        <Links />
        <Subscribe />
      </div>
    </footer>
  );
}

function Links() {
  return (
    <ul className="flex flex-col gap-3">
      <FooterLinkItem
        href="https://thirdweb.com/support"
        icon={BadgeHelpIcon}
        label="Visit our support site"
        prefix="Need help?"
      />

      <FooterLinkItem
        href="https://www.youtube.com/@thirdweb_"
        icon={VideoIcon}
        label="video Tutorials"
        prefix="Watch our"
      />

      <FooterLinkItem
        href="/changelog"
        icon={ScrollTextIcon}
        label="changelog"
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
        <props.icon className="size-5" />
        <span>{props.prefix}</span>
      </div>

      <DocLink href={props.href}>{props.label}</DocLink>
    </li>
  );
}
