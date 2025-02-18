import thirdwebIconSrc from "@/../public/thirdweb.svg";
import { Sidebar, type SidebarLink } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { ScrollShadow } from "../components/ui/ScrollShadow/ScrollShadow";
import { otherLinks } from "./otherLinks";

export function AppSidebar(props: {
  links: SidebarLink[];
}) {
  return (
    <div className="z-10 hidden h-dvh w-[300px] flex-col border-border/50 border-r-2 xl:flex">
      <div className="border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <Image src={thirdwebIconSrc} className="size-6" alt="thirdweb" />
          <span className="font-bold text-lg leading-none tracking-tight">
            Playground
          </span>
        </div>
      </div>

      <div className="relative flex max-h-full flex-1 flex-col overflow-hidden">
        <ScrollShadow
          className="grow pr-4 pl-6"
          scrollableClassName="max-h-full pt-6"
        >
          <Sidebar links={props.links} />
        </ScrollShadow>
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t px-6 py-6">
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
