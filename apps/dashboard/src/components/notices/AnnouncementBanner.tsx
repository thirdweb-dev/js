"use client";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useLocalStorage } from "hooks/useLocalStorage";
import { CircleAlertIcon, XIcon } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";

export function AnnouncementBanner(props: {
  href: string;
  label: string;
  trackingLabel: string;
}) {
  const layoutSegment = useSelectedLayoutSegment();
  const [hasDismissedAnnouncement, setHasDismissedAnnouncement] =
    useLocalStorage(`dismissed-${props.trackingLabel}`, false, true);

  if (
    layoutSegment === "/_not-found" ||
    hasDismissedAnnouncement ||
    layoutSegment === "login" ||
    layoutSegment === "nebula-app" ||
    layoutSegment === "join" ||
    layoutSegment === "get-started"
  ) {
    return null;
  }

  return (
    <div className="fade-in-0 relative w-full animate-in bg-blue-700 px-4 py-3 pr-14 text-white duration-400">
      <TrackedLinkTW
        href={props.href}
        category="announcement"
        label={props.trackingLabel}
        target={props.href.startsWith("http") ? "_blank" : undefined}
        className="ontainer flex cursor-pointer items-center gap-2 lg:justify-center "
      >
        <CircleAlertIcon className="hidden size-5 shrink-0 lg:block" />
        <span className="inline-block font-medium leading-normal hover:underline">
          {props.label}
        </span>
      </TrackedLinkTW>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => setHasDismissedAnnouncement(true)}
        aria-label="Close announcement"
        className="-translate-y-1/2 absolute top-1/2 right-2 h-auto w-auto p-2 hover:bg-white/15 hover:text-white"
      >
        <XIcon className="size-5" />
      </Button>
    </div>
  );
}

export function OrganizeContractsToProjectsBanner() {
  return (
    <AnnouncementBanner
      href="https://playground.thirdweb.com/connect/pay"
      label="Let users pay with whatever they have without leaving your app"
      trackingLabel="ub-launch"
    />
  );
}
