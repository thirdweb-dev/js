"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SidebarLink(props: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Button asChild variant="ghost">
      <Link
        className={cn(
          "!justify-start w-full text-left font-normal text-muted-foreground",
          pathname === props.href && "text-foreground",
        )}
        href={props.href}
        onClick={props.onClick}
      >
        {props.label}
      </Link>
    </Button>
  );
}
