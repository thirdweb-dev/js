"use client";

import { Button } from "@/components/ui/button";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Menu, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { headerLinks } from "./headerLinks";

export function MobileBurgerMenu() {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (showBurgerMenu) {
      // eslint-disable-next-line react-compiler/react-compiler
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showBurgerMenu]);

  useIsomorphicLayoutEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={() => setShowBurgerMenu(!showBurgerMenu)}
      >
        <Menu strokeWidth={1} />
      </Button>

      {showBurgerMenu && (
        <nav
          className={
            "fixed top-[80px] z-50 inset-0 bg-background p-6 animate-in fade-in-20 slide-in-from-top-3 border-t"
          }
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6"
            onClick={() => setShowBurgerMenu(false)}
          >
            <XIcon strokeWidth={1} />
          </Button>

          <div className="flex flex-col gap-7">
            {[...headerLinks.left, ...headerLinks.right].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg "
                target={link.href.startsWith("https") ? "_blank" : undefined}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
