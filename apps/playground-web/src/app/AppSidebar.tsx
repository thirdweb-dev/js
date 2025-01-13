import thirdwebIconSrc from "@/../public/thirdweb.svg";
import { Sidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "./navLinks";
import { otherLinks } from "./otherLinks";

export function AppSidebar() {
  return (
    <div className="sticky top-0 z-10 hidden h-dvh w-[300px] flex-col border-border/50 border-r-2 xl:flex">
      <div className="px-6 pt-6">
        <Link
          className="flex items-center gap-2"
          href="/"
          aria-label="thirdweb Docs"
          title="thirdweb Docs"
        >
          <Image src={thirdwebIconSrc} className="size-6" alt="" />
          <span className="font-bold text-lg leading-none tracking-tight">
            Playground
          </span>
        </Link>
      </div>

      <div className="h-5" />

      <div className="px-6">
        <Sidebar links={navLinks} />
      </div>

      <div className="mt-auto flex flex-col gap-4 p-6">
        {otherLinks.map((link) => {
          return (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground "
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
