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
    <header className="flex items-center flex-shrink-0 h-20 border-b bg-card md:h-24">
      <div className="container flex flex-row items-center justify-between gap-5 py-4">
        {/* Left */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <MobileBurgerMenu />
            <Link href="/dashboard">
              <ThirdwebMiniLogo className="size-10" />
            </Link>
          </div>

          <div className="items-center hidden gap-5 md:flex">
            {headerLinks.left.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                target={link.href.startsWith("https") ? "_blank" : undefined}
                className="text-secondary-foreground hover:text-foreground"
                activeClassName="text-foreground font-semibold"
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <div className="items-center hidden gap-5 lg:flex">
            {headerLinks.right.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.href.startsWith("https") ? "_blank" : undefined}
                className="text-secondary-foreground hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <ColorModeToggle />

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
      </div>
    </header>
  );
}
