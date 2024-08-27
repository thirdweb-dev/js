"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink(props: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2",
        pathname === props.href && "bg-accent text-accent-foreground",
      )}
    >
      <Link href={props.href}>{props.children}</Link>
    </Button>
  );
}
