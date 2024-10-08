"use client";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useLocalStorage } from "hooks/useLocalStorage";
import { ChevronRightIcon, XIcon } from "lucide-react";

export function AnnouncementBanner(props: {
  href: string;
  label: string;
  trackingLabel: string;
}) {
  const [hasDismissedAnnouncement, setHasDismissedAnnouncement] =
    useLocalStorage(`dismissed-${props.trackingLabel}`, false, true);

  if (hasDismissedAnnouncement) {
    return null;
  }

  return (
    <div
      className="fade-in-0 relative w-full animate-in bg-background py-2.5 pr-14 duration-400"
      style={{
        backgroundImage:
          "linear-gradient(145deg, hsl(290deg 85% 50%), hsl(220deg 85% 50%))",
      }}
    >
      <TrackedLinkTW
        href={props.href}
        category="announcement"
        label={props.trackingLabel}
        target={props.href.startsWith("http") ? "_blank" : undefined}
        className="container flex cursor-pointer items-center gap-2 lg:justify-center"
      >
        <span className="inline-block font-semibold text-white leading-normal hover:underline">
          {props.label}
        </span>
        <ChevronRightIcon className="hidden size-5 opacity-80 lg:block" />
      </TrackedLinkTW>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => setHasDismissedAnnouncement(true)}
        aria-label="Close announcement"
        className="-translate-y-1/2 !text-white absolute top-1/2 right-2 h-auto w-auto p-2 hover:bg-white/15"
      >
        <XIcon className="size-5" />
      </Button>
    </div>
  );
}
