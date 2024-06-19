import { ColorModeToggle } from "@/components/color-mode-toggle";
import { ThirdwebMiniLogo } from "../ThirdwebMiniLogo";
import Link from "next/link";
import { MobileBurgerMenu } from "./MobileBurgerMenu";
import { headerLinks } from "./headerLinks";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";

export function DashboardHeader() {
  return (
    // the "h-24" avoids layout shift when connecting wallet (connected wallet button is taller than disconnected...)
    <header className="border-b bg-card h-20 md:h-24 flex-shrink-0 flex items-center">
      <div className="container px-4 gap-5 justify-between flex flex-row items-center py-4">
        {/* Left */}
        <div className="flex gap-5 items-center">
          <div className="flex gap-2 items-center">
            <MobileBurgerMenu />
            <Link href="/dashboard">
              <ThirdwebMiniLogo className="size-10" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-5">
            {headerLinks.left.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target={link.href.startsWith("https") ? "_blank" : undefined}
                className="text-secondary-foreground hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex gap-5 items-center">
          <div className="hidden lg:flex items-center gap-5">
            {headerLinks.right.map((link, index) => (
              <Link
                key={index}
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
            <CustomConnectWallet
              disableChainConfig={true}
              disableAddCustomNetwork={true}
            />
          </ClientOnly>
        </div>
      </div>
    </header>
  );
}
