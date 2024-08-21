import { ThirdwebIcon } from "@/icons/thirdweb";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export function Header() {
  return (
    <header className="flex w-full items-center border-b bg-background sticky top-0 z-50">
      <div className="container flex items-center justify-between gap-6 py-3">
        <div className="flex items-center gap">
          <Link
            className="flex items-center gap-2"
            href="/"
            aria-label="thirdweb Docs"
            title="thirdweb Docs"
          >
            <ThirdwebIcon className="size-8" />
            <span className="text-[23px] font-bold leading-none tracking-tight">
              Playground
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {/* <ThemeSelector /> */}
          <Button asChild size="icon" variant="ghost">
            <Link href="https://github.com/thirdweb-dev" target="_blank">
              <GithubIcon strokeWidth={1} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
