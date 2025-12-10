"use client";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { reportBridgePageLinkClick } from "@/analytics/report";

export function AddBridgeWidgetLink() {
  return (
    <BadgeLink
      href="https://portal.thirdweb.com/bridge/bridge-widget"
      label="Add Bridge widget in your app"
      onClick={() => {
        reportBridgePageLinkClick({ linkType: "integrate-bridge-widget" });
      }}
    />
  );
}

function BadgeLink(props: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={props.href}
      className="text-sm text-foreground bg-accent/50 rounded-full px-4 py-2 border hover:bg-accent flex items-center gap-2"
      target="_blank"
      onClick={props.onClick}
    >
      {props.label}
      <ArrowUpRightIcon className="size-4 text-foreground" />
    </Link>
  );
}
