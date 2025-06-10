import { ToggleThemeButton } from "@/components/color-mode-toggle";
import Link from "next/link";
import { NebulaIcon } from "../(app)/icons/NebulaIcon";
import { MoveFundsConnectButton } from "./connect-button";
import { MoveFundsPage } from "./move-funds";

export default function RecoverPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <header className="border-b bg-background">
        <div className="container flex items-center justify-between py-3">
          <div className="flex shrink-0 items-center gap-1.5">
            <NebulaIcon className="size-6 text-foreground" />
            <span className="font-medium text-xl">Nebula</span>
          </div>

          <div className="flex items-center gap-6">
            <ToggleThemeButton />

            <Link
              href="https://thirdweb.com/support"
              className="hidden text-muted-foreground text-sm hover:text-foreground lg:block"
              target="_blank"
            >
              Support
            </Link>

            <MoveFundsConnectButton />
          </div>
        </div>
      </header>

      <MoveFundsPage />
    </div>
  );
}
