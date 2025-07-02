"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
        className="container flex cursor-pointer items-center gap-2 lg:justify-center"
        href={props.href}
        rel={props.href.startsWith("http") ? "noopener noreferrer" : undefined}
        target={props.href.startsWith("http") ? "_blank" : undefined}
      >
        <span className="inline-block font-medium leading-normal hover:underline">
          {props.label}
        </span>
      </Link>

      <Button
        aria-label="Close announcement"
        className="-translate-y-1/2 absolute top-1/2 right-2 h-auto w-auto p-2 hover:bg-white/15 hover:text-white"
        onClick={() => setHasDismissedAnnouncement(true)}
        size="icon"
        variant="ghost"
      >
        <XIcon className="size-5" />
      </Button>
    </div>
  );
}

export function AnnouncementBanner() {
  return (
    <AnnouncementBannerUI
      href="https://blog.thirdweb.com/the-fastest-way-to-build-web3-applications/"
      label="We have re-branded our Engine, Universal Bridge, and Connect products. Please read the full blog post for details on changes"
      trackingLabel="product-rebrand"
    />
  );
}
