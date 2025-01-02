"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CmdKSearch } from "../../../../components/cmd-k-search";
import { SecondaryNavLinks } from "../../../components/Header/SecondaryNav/SecondaryNav";
import { MobileBurgerMenuButton } from "../../../components/MobileBurgerMenuButton";
import { ThirdwebMiniLogo } from "../../../components/ThirdwebMiniLogo";

export function TeamHeaderLoggedOutDesktopUI(props: {
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <header
      className={cn(
        "flex flex-row items-center justify-between gap-2 px-6 py-4 text-foreground ",
        props.className,
      )}
    >
      <div className="flex items-center gap-4">
        <Link href="/team">
          <ThirdwebMiniLogo className="h-5" />
        </Link>

        <CmdKSearch className="h-auto py-1.5" />
      </div>

      <div className="flex items-center gap-6">
        <SecondaryNavLinks />

        <Button size="sm" variant="primary" className="rounded-lg" asChild>
          <Link
            href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
          >
            Connect Wallet
          </Link>
        </Button>
      </div>
    </header>
  );
}

export function TeamHeaderLoggedOutMobileUI(props: {
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "flex flex-row items-center justify-between gap-2 px-4 py-4 text-foreground",
        props.className,
      )}
    >
      <Link href="/team">
        <ThirdwebMiniLogo className="h-5" />
      </Link>

      <div className="flex items-center gap-3">
        <Button size="sm" variant="primary" className="rounded-lg" asChild>
          <Link
            href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
          >
            Connect Wallet
          </Link>
        </Button>
        <MobileBurgerMenuButton type="loggedOut" />
      </div>
    </header>
  );
}

export function TeamHeaderLoggedOut() {
  return (
    <div>
      <TeamHeaderLoggedOutDesktopUI className="max-lg:hidden" />
      <TeamHeaderLoggedOutMobileUI className="lg:hidden" />
    </div>
  );
}
