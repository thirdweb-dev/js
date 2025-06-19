"use client";

import { Button } from "@/components/ui/button";
import { useLocalStorage } from "hooks/useLocalStorage";
import { XIcon } from "lucide-react";
import Link from "next/link";

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
      <Link
        href={props.href}
        target={props.href.startsWith("http") ? "_blank" : undefined}
        rel={props.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="container flex cursor-pointer items-center gap-2 lg:justify-center"
      >
        <span className="inline-block font-medium leading-normal hover:underline">
          {props.label}
        </span>
      </Link>

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
