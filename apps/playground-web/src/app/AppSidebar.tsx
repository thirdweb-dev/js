import thirdwebIconSrc from "@/../public/thirdweb.svg";
import { Sidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "./navLinks";
import { otherLinks } from "./otherLinks";

export function AppSidebar() {
  return (
    <div className="w-[300px] top-0 sticky z-10 h-screen flex-col hidden xl:flex border-r-2 border-border/50">
      <div className="px-6 pt-6">
        <Link
          className="flex items-center gap-2"
          href="/"
          aria-label="thirdweb Docs"
          title="thirdweb Docs"
        >
          <Image src={thirdwebIconSrc} className="size-6" alt="" />
          <span className="text-lg font-bold leading-none tracking-tight">
            Playground
          </span>
        </Link>
      </div>

      <div className="h-5" />

      <div className="px-6">
        <Sidebar links={navLinks} />
      </div>

      <div className="flex flex-col gap-4 mt-auto p-6">
        {otherLinks.map((link) => {
          return (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 "
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
