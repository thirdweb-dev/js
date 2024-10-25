import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CmdKSearch } from "../../../../components/cmd-k-search";
import { SecondaryNavLinks } from "../../../components/Header/SecondaryNav/SecondaryNav";
import { MobileBurgerMenuButton } from "../../../components/MobileBurgerMenuButton";
import { ThirdwebMiniLogo } from "../../../components/ThirdwebMiniLogo";

export function TeamHeaderLoggedOutDesktopUI(props: {
  className?: string;
}) {
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
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </header>
  );
}

export function TeamHeaderLoggedOutMobileUI(props: {
  className?: string;
}) {
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
          <Link href="/login">Sign in</Link>
        </Button>
        <MobileBurgerMenuButton type="loggedOut" />
      </div>
    </header>
  );
}
