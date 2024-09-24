import { ColorModeToggle } from "@/components/color-mode-toggle";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import Link from "next/link";
import { ThirdwebMiniLogo } from "../ThirdwebMiniLogo";
import { NavLink } from "../nav-link.client";
import { MobileBurgerMenu } from "./MobileBurgerMenu";
import { headerLinks } from "./headerLinks";

export function DashboardHeader() {
  return (
    // the "h-24" avoids layout shift when connecting wallet (connected wallet button is taller than disconnected...)
    <header className="flex h-20 flex-shrink-0 flex-row items-center justify-between border-border border-b bg-muted/50 px-4 py-4 md:h-20 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <MobileBurgerMenu />
          <Link href="/dashboard">
            <ThirdwebMiniLogo className="h-6" />
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {headerLinks.left.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              target={link.href.startsWith("https") ? "_blank" : undefined}
              className="px-[10px] py-2 font-normal text-muted-foreground text-sm hover:text-foreground"
              activeClassName="font-medium text-foreground"
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="items-center gap-2 lg:flex">
          <div className="hidden items-center gap-2 lg:flex">
            {headerLinks.right.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.href.startsWith("https") ? "_blank" : undefined}
                className="px-[10px] py-2 font-normal text-muted-foreground text-sm hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <ColorModeToggle />
        </div>

        <ClientOnly
          ssr={
            <div className="flex h-[48px] w-[144px] items-center justify-center rounded-lg border bg-muted/50">
              <Spinner className="size-4" />
            </div>
          }
        >
          <CustomConnectWallet />
        </ClientOnly>
      </div>
    </header>
  );
}
