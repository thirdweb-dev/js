"use client";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function Banner(props: { text: string; href: string; id: string }) {
  const [showBanner, setShowBanner] = useState(false);

  const bannerCancelledKey = `banner-cancelled${props.href}`;

  useEffect(() => {
    try {
      if (localStorage.getItem(bannerCancelledKey) !== "true") {
        setShowBanner(true);
      }
    } catch {
      // ignore
    }
  }, [bannerCancelledKey]);

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="fade-in-0 flex animate-in items-center justify-center gap-2 p-3 pr-20 transition-opacity duration-700"
      style={{
        background:
          "linear-gradient(145.96deg, rgb(65, 10, 182) 5.07%, rgb(60 132 246) 100%)",
      }}
    >
      <Link
        href={props.href}
        target={props.href.startsWith("http") ? "_blank" : undefined}
        className="font-bold hover:underline"
        style={{
          color: "white",
        }}
      >
        {props.text}
      </Link>
      <Button
        className="absolute right-4 shrink-0 bg-none bg-transparent p-1"
        onClick={() => {
          setShowBanner(false);
          try {
            localStorage.setItem(bannerCancelledKey, "true");
          } catch {
            // ignore
          }
        }}
      >
        <XIcon
          className="size-5 "
          style={{
            color: "white",
          }}
        />
      </Button>
    </div>
  );
}
