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
    <header className="flex flex-row items-center justify-between flex-shrink-0 h-20 border-b border-border bg-background md:h-24 py-4 px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <MobileBurgerMenu />
          <Link href="/dashboard">
            <ThirdwebMiniLogo className="h-7" />
          </Link>
        </div>

        <div className="items-center hidden gap-2 md:flex">
          {headerLinks.left.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              target={link.href.startsWith("https") ? "_blank" : undefined}
              className="text-secondary-foreground font-medium py-2 px-[10px] hover:text-foreground"
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
          <div className="items-center hidden gap-2 lg:flex">
            {headerLinks.right.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.href.startsWith("https") ? "_blank" : undefined}
                className="text-secondary-foreground font-medium py-2 px-[10px] hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <ColorModeToggle />
        </div>

        <ClientOnly
          ssr={
            <div className="w-[144px] h-[48px] bg-muted border rounded-lg flex items-center justify-center">
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
