import {
  BadgeHelpIcon,
  type LucideIcon,
  ScrollTextIcon,
  VideoIcon,
} from "lucide-react";
import { DocLink } from ".";
import { Feedback } from "../others/Feedback";
import { Subscribe } from "../others/Subscribe";
import { AutoEditPageButton } from "./AutoEditPageButton";

export function PageFooter(props: { editPageButton?: true }) {
  return (
    <footer className="flex flex-col gap-7 pb-20" data-noindex>
      <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
        {props.editPageButton && <AutoEditPageButton />}
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
        prefix="Need help?"
        label="Visit our support site"
        href="https://thirdweb.com/support"
        icon={BadgeHelpIcon}
      />

      <FooterLinkItem
        prefix="Watch our"
        label="Video Tutorials"
        href="https://www.youtube.com/@thirdweb_"
        icon={VideoIcon}
      />

      <FooterLinkItem
        prefix="View our"
        label="Changelog"
        href="/changelog"
        icon={ScrollTextIcon}
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
