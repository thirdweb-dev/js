"use client";

import thirdwebIconSrc from "@/../public/thirdweb.svg";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Sidebar } from "../components/ui/sidebar";
import { navLinks } from "./navLinks";
import { otherLinks } from "./otherLinks";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <header
      className="py-4 xl:hidden border-b px-4 flex justify-between gap-4 sticky top-0 z-10 bg-background "
      onClick={(e) => {
        if (e.target instanceof HTMLAnchorElement) {
          setIsOpen(false);
        }
      }}
    >
      <Link
        className="flex items-center gap-3"
        href="/"
        aria-label="thirdweb Docs"
        title="thirdweb Docs"
      >
        <Image src={thirdwebIconSrc} className="size-7" alt="" />
        <span className="text-xl font-bold leading-none tracking-tight">
          Playground
        </span>
      </Link>

      <Button
        variant="outline"
        className="!h-auto p-2"
        onClick={() => {
          setIsOpen((v) => !v);
        }}
      >
        {!isOpen ? (
          <MenuIcon className="size-6" />
        ) : (
          <XIcon className="size-6" />
        )}
      </Button>

      {isOpen && (
        <div className="fixed left-0 top-[75px] right-0 bottom-0 bg-background p-6 z-50 flex flex-col gap-6 fade-in-0 animate-in duration-200 slide-in-from-top-5 overflow-auto">
          <Sidebar links={navLinks} />
          <div className="flex flex-col gap-4 mt-auto">
            {otherLinks.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 "
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
