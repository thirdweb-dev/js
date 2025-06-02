"use client";

import { DocSearch } from "@/components/others/DocSearch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import {
  ChevronDownIcon,
  MenuIcon,
  MessageCircleIcon,
  TableOfContentsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { GithubIcon } from "../components/Document/GithubButtonLink";
import { CustomAccordion } from "../components/others/CustomAccordion";
import { ThemeSwitcher } from "../components/others/theme/ThemeSwitcher";
import {
  DotNetIcon,
  ReactIcon,
  TypeScriptIcon,
  UnityIcon,
  UnrealEngineIcon,
} from "../icons";
import { ThirdwebIcon } from "../icons/thirdweb";

const links = [
  {
    name: "Connect",
    href: "/connect",
  },
  {
    name: "Bridge",
    href: "/pay",
  },
  {
    name: "Engine",
    href: "/engine",
  },
  {
    name: "Contracts",
    href: "/contracts",
  },
  {
    name: "Insight",
    href: "/insight",
  },
  {
    name: "Nebula",
    href: "/nebula",
  },
  {
    name: "Vault",
    href: "/vault",
  },
];

const toolLinks = [
  {
    name: "Chain List",
    href: "https://thirdweb.com/chainlist",
  },
  {
    name: "Wei Converter",
    href: "https://thirdweb.com/tools/wei-converter",
  },
  {
    name: "Hex Converter",
    href: "https://thirdweb.com/tools/hex-converter",
  },
  {
    name: "API Keys",
    href: "/account/api-keys",
  },
  {
    name: "CLI",
    href: "/cli",
  },
];

export const connectLinks: Array<{
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}> = [
  {
    name: "Overview",
    href: "/connect",
    icon: TableOfContentsIcon,
  },
  {
    name: "TypeScript",
    href: "/typescript/v5",
    icon: TypeScriptIcon,
  },
  {
    name: "React",
    href: "/react/v5",
    icon: ReactIcon,
  },
  {
    name: "React Native",
    href: "/react-native/v5",
    icon: ReactIcon,
  },
  {
    name: ".NET",
    href: "/dotnet",
    icon: DotNetIcon,
  },
  {
    name: "Unity",
    href: "/unity",
    icon: UnityIcon,
  },
  {
    name: "Unreal Engine",
    href: "/unreal-engine",
    icon: UnrealEngineIcon,
  },
] as const;

const apisLinks = [
  {
    name: "Nebula",
    href: "/nebula/api-reference",
  },
  {
    name: "Insight",
    href: "https://insight.thirdweb.com/reference",
  },
  {
    name: "Engine Cloud",
    href: "https://engine.thirdweb.com/reference#tag/write",
  },
  {
    name: "Universal Bridge",
    href: "https://bridge.thirdweb.com/reference",
  },
];

const sdkLinks = [
  {
    name: "TypeScript",
    href: "/typescript/v5",
    icon: TypeScriptIcon,
  },
  {
    name: "React",
    href: "/react/v5",
    icon: ReactIcon,
  },
  {
    name: "React Native",
    href: "/react-native/v5",
    icon: ReactIcon,
  },
  {
    name: ".NET",
    href: "/dotnet",
    icon: DotNetIcon,
  },
  {
    name: "Unity",
    href: "/unity",
    icon: UnityIcon,
  },
  {
    name: "Unreal Engine",
    href: "/unreal-engine",
    icon: UnrealEngineIcon,
  },
];

const supportLinks = [
  {
    name: "Get thirdweb support",
    href: "/knowledge-base",
  },
  {
    name: "Account",
    href: "/account",
  },
  {
    name: "Status",
    href: "https://status.thirdweb.com",
  },
];

export function Header() {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const router = useRouter();

  return (
    <header className="flex w-full flex-col gap-2 border-b bg-background p-2 lg:px-4">
      <div className="container flex items-center justify-between gap-6">
        {/* Top row */}
        <div className="flex items-center gap-2">
          <Link
            className="flex items-center gap-2"
            href="/"
            aria-label="thirdweb Docs"
            title="thirdweb Docs"
          >
            <ThirdwebIcon className="size-8" />
            <span className="font-bold text-[23px] text-foreground leading-none tracking-tight">
              Docs
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden xl:block">
            <DocSearch variant="search" />
          </div>

          <div className="hidden xl:block">
            <Button
              onClick={() => {
                router.push("/chat");
              }}
            >
              <MessageCircleIcon className="mr-2 size-4" />
              Ask AI
            </Button>
          </div>

          <div className="hidden xl:block">
            <ThemeSwitcher className="border-none bg-transparent" />
          </div>

          <div className="hidden xl:block">
            <Link
              href="https://github.com/thirdweb-dev"
              target="_blank"
              className="text-foreground"
            >
              <GithubIcon className="mx-3 size-6" />
            </Link>
          </div>

          <div className="flex items-center gap-1 xl:hidden">
            <ThemeSwitcher className="border-none bg-transparent" />
            <DocSearch variant="icon" />
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => router.push("/chat")}
            >
              <MessageCircleIcon className="size-7" />
            </Button>
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setShowBurgerMenu(!showBurgerMenu)}
            >
              <MenuIcon className="size-7" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom row - hidden on mobile */}
      <div className="container hidden items-center justify-between gap-6 xl:flex">
        <nav className="flex grow gap-5">
          <ul className="flex flex-row items-center gap-5">
            {links.map((link) => {
              return (
                <li
                  className="flex items-center"
                  key={link.href}
                  onClick={() => {
                    setShowBurgerMenu(false);
                  }}
                  onKeyDown={() => {
                    setShowBurgerMenu(false);
                  }}
                >
                  <NavLink name={link.name} href={link.href} />
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="px-1">
            <DropdownLinks
              links={sdkLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
              category="SDKs"
            />
          </div>
          <div className="px-1">
            <DropdownLinks
              links={apisLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
              category="APIs"
            />
          </div>

          <div className="px-1">
            <DropdownLinks
              links={toolLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
              category="Tools"
            />
          </div>

          <div className="px-1">
            <DropdownLinks
              links={supportLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
              category="Support"
            />
          </div>

          <NavLink
            name="Changelog"
            href="/changelog"
            onClick={() => {
              setShowBurgerMenu(false);
            }}
          />
        </div>
      </div>

      {/* Mobile menu */}
      {showBurgerMenu && (
        <div className="fixed inset-0 top-sticky-top-height z-50 overflow-auto bg-card p-6 xl:hidden">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">Products</h3>
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  name={link.name}
                  href={link.href}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">SDKs</h3>
              {sdkLinks.map((link) => (
                <NavLink
                  key={link.name}
                  name={link.name}
                  href={link.href}
                  icon={link.icon}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">APIs</h3>
              {apisLinks.map((link) => (
                <NavLink
                  key={link.name}
                  name={link.name}
                  href={link.href}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">Support</h3>
              {supportLinks.map((link) => (
                <NavLink
                  key={link.name}
                  name={link.name}
                  href={link.href}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>

            <NavLink
              name="Changelog"
              href="/changelog"
              onClick={() => setShowBurgerMenu(false)}
            />

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">Tools</h3>
              {toolLinks.map((link) => (
                <NavLink
                  key={link.name}
                  name={link.name}
                  href={link.href}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownLinks(props: {
  onLinkClick?: () => void;
  category: string;
  links: readonly {
    name: string;
    href: string;
    icon?: React.FC<{ className?: string }>;
  }[];
}) {
  return (
    <>
      {/* desktop */}
      <div className="hidden items-center xl:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="inline-flex items-center gap-1 p-0 font-medium text-muted-foreground text-sm hover:bg-transparent hover:text-foreground"
            >
              {props.category}
              <ChevronDownIcon className="size-4 text-muted-foreground opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="flex flex-col gap-1 bg-card p-3"
            style={{
              minWidth: "150px",
            }}
          >
            {props.links.map((info) => {
              return (
                <DropdownMenuItem asChild key={info.name}>
                  <div
                    className={clsx(
                      "relative flex cursor-pointer gap-2 font-medium text-foreground",
                      "hover:bg-accent",
                    )}
                  >
                    {info.icon && (
                      <info.icon className="size-5 text-foreground" />
                    )}
                    <Link
                      prefetch={false}
                      target={info.href.startsWith("http") ? "_blank" : ""}
                      href={info.href}
                      className="before:absolute before:inset-0"
                    >
                      {info.name}
                    </Link>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* mobile */}
      <div className="xl:hidden">
        <CustomAccordion
          chevronPosition="right"
          containerClassName="border-none"
          trigger={props.category}
          triggerContainerClassName="py-0 text-base font-medium text-muted-foreground"
        >
          <div className="pt-2">
            <div className="flex flex-col gap-4 border-l-2 pt-3 pl-4">
              {props.links.map((info) => {
                return (
                  <NavLink
                    key={info.name}
                    name={info.name}
                    href={info.href}
                    onClick={props.onLinkClick}
                    icon={info.icon}
                  />
                );
              })}
            </div>
          </div>
        </CustomAccordion>
      </div>
    </>
  );
}

function NavLink(props: {
  href: string;
  name: string;
  onClick?: () => void;
  icon?: React.FC<{ className?: string }>;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={props.href}
      onClick={props.onClick}
      target={props.href.startsWith("http") ? "_blank" : ""}
      className={clsx(
        "font-medium text-base transition-colors hover:text-foreground xl:text-sm",
        pathname === props.href ? "text-foreground" : "text-muted-foreground ",
        props.icon ? "flex flex-row gap-3" : "",
      )}
    >
      {props.icon ? (
        <>
          <props.icon className="size-6 text-muted-foreground" />
          <span className="my-auto">{props.name}</span>
        </>
      ) : (
        props.name
      )}
    </Link>
  );
}
