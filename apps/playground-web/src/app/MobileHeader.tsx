"use client";

import thirdwebIconSrc from "@/../public/thirdweb.svg";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScrollShadow } from "../components/ui/ScrollShadow/ScrollShadow";
import { Button } from "../components/ui/button";
import { Sidebar, type SidebarLink } from "../components/ui/sidebar";
import { otherLinks } from "./otherLinks";

export function MobileHeader(props: {
  links: SidebarLink[];
}) {
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
    <>
      <header className="sticky top-0 z-10 flex justify-between gap-4 border-b bg-background px-4 py-4 xl:hidden">
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
      </header>

      {isOpen && (
        <div
          className="fade-in-0 slide-in-from-top-5 fixed top-[75px] right-0 bottom-0 left-0 z-50 flex animate-in flex-col bg-background duration-200"
          onClickCapture={(e) => {
            if (e.target instanceof HTMLElement && e.target.closest("a")) {
              setIsOpen(false);
            }
          }}
        >
          <div className="relative flex max-h-full flex-1 flex-col overflow-hidden">
            <ScrollShadow
              className="grow px-6"
              scrollableClassName="max-h-full pt-6"
            >
              <Sidebar links={props.links} />
            </ScrollShadow>
          </div>

          <div className="mt-auto flex flex-col gap-4 border-t px-6 py-6">
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
    </>
  );
}
