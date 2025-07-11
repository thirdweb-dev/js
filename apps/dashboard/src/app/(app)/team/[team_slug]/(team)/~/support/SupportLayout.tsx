"use client";

import { cn } from "@/lib/utils";

export function SupportLayout(props: { children: React.ReactNode }) {
  // If mobile navigation is needed in the future, add state and logic here.
  const showFullNavOnMobile = true;

  return (
    <div className="flex grow flex-col">
      {/* Page content */}
      <div className="container flex grow gap-8 lg:min-h-[900px] [&>*]:py-8 lg:[&>*]:py-10">
        <div
          className={cn(
            "flex max-w-full grow flex-col",
            showFullNavOnMobile && "max-sm:hidden",
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
