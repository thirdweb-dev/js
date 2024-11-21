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
      className="sticky top-0 z-10 flex justify-between gap-4 border-b bg-background px-4 py-4 xl:hidden "
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
        <span className="font-bold text-xl leading-none tracking-tight">
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
        <div className="fade-in-0 slide-in-from-top-5 fixed top-[75px] right-0 bottom-0 left-0 z-50 flex animate-in flex-col gap-6 overflow-auto bg-background p-6 duration-200">
          <Sidebar links={navLinks} />
          <div className="mt-auto flex flex-col gap-4">
            {otherLinks.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground "
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
