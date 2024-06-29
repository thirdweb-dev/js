"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { SidebarSection } from "./section";
import type { SidebarNavSection } from "./types";

export type SideBarNavProps = {
  sections: Array<SidebarNavSection>;
};

export const SidebarNav: React.FC<SideBarNavProps> = ({ sections }) => {
  const currentPath = usePathname() || "";

  const activeLinkInSections = useMemo(() => {
    for (const section of sections) {
      return section.items.find((item) => item.href.startsWith(currentPath));
    }
  }, [sections, currentPath]);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // legitimate use case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // close mobile sidebar when path changes
    if (currentPath) {
      setIsMobileOpen(false);
    }
  }, [currentPath]);

  return (
    <aside className="w-full md:w-[300px] border-b md:border-b-0 relative md:sticky top-0 flex-shrink-0">
      {/* mobile toggle */}
      <div className="flex flex-row md:hidden w-full justify-between items-center p-4">
        <label className="flex items-center text-accent-foreground font-semibold text-sm pl-3 border-l-2 border-primary h-8">
          {activeLinkInSections?.title || "Dashboard"}
        </label>
        <Button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          size="icon"
          variant="outline"
        >
          <MenuIcon />
        </Button>
      </div>
      {/* actual link sections */}
      <div
        className={cn(
          "transition-all md:transition-none max-h-0 md:max-h-full md:h-full overflow-hidden md:overflow-auto absolute md:bg-transparent md:relative w-full px-4 md:py-6",
          isMobileOpen &&
            "h-svh max-h-svh top-full mt-[1px] md:top-0 overflow-auto backdrop-blur-lg md:backdrop-blur-none py-4 bg-background/50 z-50",
        )}
      >
        {sections.map((section) => (
          <SidebarSection section={section} key={section.id} />
        ))}
      </div>
    </aside>
  );
};
