import { ToggleThemeButton } from "@/components/color-mode-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThirdwebMiniLogo } from "../../../../../../components/ThirdwebMiniLogo";
import { PublicPageConnectButton } from "./PublicPageConnectButton";

export function PageHeader(props: {
  containerClassName?: string;
}) {
  return (
    <div className="border-b border-dashed">
      <header
        className={cn(
          "container flex max-w-8xl justify-between py-3",
          props.containerClassName,
        )}
      >
        <div className="flex items-center gap-4">
          <Link href="/team" className="flex items-center gap-2">
            <ThirdwebMiniLogo className="h-5" />
            <span className="hidden font-bold text-2xl tracking-tight lg:block">
              thirdweb
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <ToggleThemeButton />
          <PublicPageConnectButton />
        </div>
      </header>
    </div>
  );
}
