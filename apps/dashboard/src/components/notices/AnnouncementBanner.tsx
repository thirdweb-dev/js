"use client";

import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useLocalStorage } from "hooks/useLocalStorage";
import { XIcon } from "lucide-react";

function AnnouncementBannerUI(props: {
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
    <div className="fade-in-0 relative w-full animate-in bg-blue-700 px-4 py-3 pr-14 text-white duration-400">
      <TrackedLinkTW
        href={props.href}
        category="announcement"
        label={props.trackingLabel}
        target={props.href.startsWith("http") ? "_blank" : undefined}
        className="ontainer flex cursor-pointer items-center gap-2 lg:justify-center "
      >
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

export function AnnouncementBanner() {
  return (
    <AnnouncementBannerUI
      href="https://nebula.thirdweb.com/"
      label="Announcing Nebula App — the most powerful AI for blockchains! Try it now!"
      trackingLabel="nebula-beta-launch"
    />
  );
}
