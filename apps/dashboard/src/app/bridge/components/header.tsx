import Link from "next/link";
import { ToggleThemeButton } from "@/components/blocks/color-mode-toggle";
import { cn } from "@/lib/utils";
import { PublicPageConnectButton } from "../../(app)/(dashboard)/(chain)/[chain_id]/[contractAddress]/public-pages/_components/PublicPageConnectButton";
import { ThirdwebMiniLogo } from "../../(app)/components/ThirdwebMiniLogo";

export function PageHeader(props: { containerClassName?: string }) {
  return (
    <div className="border-b border-dashed">
      <header
        className={cn(
          "container flex max-w-7xl justify-between py-4",
          props.containerClassName,
        )}
      >
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-2" href="/team">
            <ThirdwebMiniLogo className="h-5" />
            <span className="hidden font-bold text-2xl tracking-tight lg:block">
              thirdweb
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="https://portal.thirdweb.com/bridge"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
          <ToggleThemeButton className="bg-transparent" />
          <PublicPageConnectButton connectButtonClassName="!rounded-full" />
        </div>
      </header>
    </div>
  );
}
