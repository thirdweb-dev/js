"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ThirdwebClient } from "thirdweb";
import { ToggleThemeButton } from "@/components/blocks/color-mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SecondaryNavLinks } from "../../../components/Header/SecondaryNav/SecondaryNav";
import { MobileBurgerMenuButton } from "../../../components/MobileBurgerMenuButton";
import { ThirdwebMiniLogo } from "../../../components/ThirdwebMiniLogo";

function HeaderLoggedOutDesktopUI(props: {
  className?: string;
  client: ThirdwebClient;
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

        {/* This will be added later */}
        {/* <CmdKSearch className="h-auto py-1.5" /> */}
      </div>

      <div className="flex items-center gap-6">
        <SecondaryNavLinks />

        <div className="flex items-center gap-4">
          <Button asChild className="rounded-lg" size="sm">
            <Link
              href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
            >
              Connect Wallet
            </Link>
          </Button>

          <ToggleThemeButton />
        </div>
      </div>
    </header>
  );
}

function HeaderLoggedOutMobileUI(props: {
  className?: string;
  client: ThirdwebClient;
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
        <Button asChild className="rounded-lg" size="sm">
          <Link
            href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
          >
            Connect Wallet
          </Link>
        </Button>
        <MobileBurgerMenuButton client={props.client} type="loggedOut" />
      </div>
    </header>
  );
}

export function HeaderLoggedOut(props: { client: ThirdwebClient }) {
  return (
    <div>
      <HeaderLoggedOutDesktopUI
        className="max-lg:hidden"
        client={props.client}
      />
      <HeaderLoggedOutMobileUI className="lg:hidden" client={props.client} />
    </div>
  );
}
