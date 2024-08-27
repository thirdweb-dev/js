"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarLink(props: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <Button asChild variant="ghost">
      <Link
        href={props.href}
        className={cn(
          "w-full text-muted-foreground text-left !justify-start",
          pathname === props.href && "text-foreground",
        )}
      >
        {props.label}
      </Link>
    </Button>
  );
}
