"use client";

import clsx from "clsx";
import { ChevronDownIcon, MenuIcon, TableOfContentsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DocSearch } from "@/components/others/DocSearch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatButton } from "../components/AI/chat-button";
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
    href: "/wallets",
    name: "Wallets",
  },
  {
    href: "/payments",
    name: "Payments",
  },
  {
    href: "/transactions",
    name: "Transactions",
  },
  {
    href: "/contracts",
    name: "Contracts",
  },
  {
    href: "/tokens",
    name: "Tokens",
  },
];

const toolLinks = [
  {
    href: "https://thirdweb.com/chainlist",
    name: "Chain List",
  },
  {
    href: "https://thirdweb.com/tools/wei-converter",
    name: "Wei Converter",
  },
  {
    href: "https://thirdweb.com/tools/hex-converter",
    name: "Hex Converter",
  },
  {
    href: "/account/api-keys",
    name: "API Keys",
  },
  {
    href: "/cli",
    name: "CLI",
  },
];

export const connectLinks: Array<{
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}> = [
  {
    href: "/wallets",
    icon: TableOfContentsIcon,
    name: "Overview",
  },
  {
    href: "/typescript/v5",
    icon: TypeScriptIcon,
    name: "TypeScript",
  },
  {
    href: "/react/v5",
    icon: ReactIcon,
    name: "React",
  },
  {
    href: "/react-native/v5",
    icon: ReactIcon,
    name: "React Native",
  },
  {
    href: "/dotnet",
    icon: DotNetIcon,
    name: ".NET",
  },
  {
    href: "/unity",
    icon: UnityIcon,
    name: "Unity",
  },
  {
    href: "/unreal-engine",
    icon: UnrealEngineIcon,
    name: "Unreal Engine",
  },
] as const;

const apisLinks = [
  {
    href: "https://api.thirdweb.com/reference",
    name: "HTTP API",
  },
  {
    href: "https://insight.thirdweb.com/reference",
    name: "Insight",
  },
  {
    href: "https://engine.thirdweb.com/reference#tag/write",
    name: "Transactions",
  },
  {
    href: "https://bridge.thirdweb.com/reference",
    name: "Payments",
  },
  {
    href: "/bundler",
    name: "Bundler",
  },
];

const aiLinks = [
  {
    href: "/ai/mcp",
    name: "MCP",
  },
  {
    href: "/ai/llm-txt",
    name: "LLMs.txt",
  },
];

const sdkLinks = [
  {
    href: "/references/typescript/v5",
    icon: TypeScriptIcon,
    name: "TypeScript",
  },
  {
    href: "/references/typescript/v5",
    icon: ReactIcon,
    name: "React",
  },
  {
    href: "/references/typescript/v5",
    icon: ReactIcon,
    name: "React Native",
  },
  {
    href: "/dotnet",
    icon: DotNetIcon,
    name: ".NET",
  },
  {
    href: "/unity",
    icon: UnityIcon,
    name: "Unity",
  },
  {
    href: "/unreal-engine",
    icon: UnrealEngineIcon,
    name: "Unreal Engine",
  },
];

const supportLinks = [
  {
    href: "/knowledge-base",
    name: "Articles",
  },
  {
    href: "/account",
    name: "Account",
  },
  {
    href: "https://status.thirdweb.com",
    name: "Status",
  },
];

export function Header() {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex w-full flex-col gap-2 border-b bg-background p-4 xl:pb-0 lg:px-8 overflow-hidden">
      {/* Top row */}
      <div className="container flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Link
            aria-label="thirdweb Docs"
            className="flex items-center gap-2"
            href="/"
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
            <Link
              className="text-foreground"
              href="https://github.com/thirdweb-dev"
              target="_blank"
            >
              <GithubIcon className="size-6 lg:size-5" />
            </Link>
          </div>

          <div className="hidden xl:block">
            <ThemeSwitcher className="border-none bg-transparent" />
          </div>

          <div className="hidden xl:block">
            <DocSearch variant="search" />
          </div>

          <div className="hidden xl:block">
            <ChatButton />
          </div>

          <div className="flex items-center gap-1 xl:hidden">
            <ThemeSwitcher className="border-none bg-transparent" />
            <DocSearch variant="icon" />
            <ChatButton />
            <Button
              className="p-2"
              onClick={() => setShowBurgerMenu(!showBurgerMenu)}
              variant="ghost"
            >
              <MenuIcon className="size-7" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom row - hidden on mobile */}
      <div className="container hidden items-center justify-between gap-6 xl:flex mt-1">
        <nav className="flex grow gap-5">
          <ul className="flex flex-row items-center gap-0 mb-1">
            {links.map((link) => {
              return (
                <li
                  className="flex items-center py-2 relative px-2.5 hover:text-foreground"
                  key={link.href}
                  onClick={() => {
                    setShowBurgerMenu(false);
                  }}
                  onKeyDown={() => {
                    setShowBurgerMenu(false);
                  }}
                >
                  <NavLink href={link.href} name={link.name} />
                  {pathname.startsWith(link.href) && (
                    <div className="bg-violet-700 h-[2px] inset-x-0 rounded-full absolute -bottom-1" />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="px-1">
            <DropdownLinks
              category="AI"
              links={aiLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
            />
          </div>
          <div className="px-1">
            <DropdownLinks
              category="SDKs"
              links={sdkLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
            />
          </div>
          <div className="px-1">
            <DropdownLinks
              category="APIs"
              links={apisLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
            />
          </div>

          <div className="px-1">
            <DropdownLinks
              category="Tools"
              links={toolLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
            />
          </div>

          <div className="px-1">
            <DropdownLinks
              category="Support"
              links={supportLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
            />
          </div>

          <NavLink
            href="/changelog"
            name="Changelog"
            onClick={() => {
              setShowBurgerMenu(false);
            }}
          />
        </div>
      </div>

      {/* Mobile menu */}
      {showBurgerMenu && (
        <div className="fixed inset-0 top-sticky-top-height z-[50] overflow-auto bg-card p-6 xl:hidden">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">Products</h3>
              {links.map((link) => (
                <NavLink
                  href={link.href}
                  key={link.name}
                  name={link.name}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">AI</h3>
              {aiLinks.map((link) => (
                <NavLink
                  href={link.href}
                  key={link.name}
                  name={link.name}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">SDKs</h3>
              {sdkLinks.map((link) => (
                <NavLink
                  href={link.href}
                  key={link.name}
                  icon={link.icon}
                  name={link.name}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">APIs</h3>
              {apisLinks.map((link) => (
                <NavLink
                  href={link.href}
                  key={link.name}
                  name={link.name}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">Support</h3>
              {supportLinks.map((link) => (
                <NavLink
                  href={link.href}
                  key={link.name}
                  name={link.name}
                  onClick={() => setShowBurgerMenu(false)}
                />
              ))}
            </div>

            <NavLink
              href="/changelog"
              name="Changelog"
              onClick={() => setShowBurgerMenu(false)}
            />

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">Tools</h3>
              {toolLinks.map((link) => (
                <NavLink
                  href={link.href}
                  key={link.name}
                  name={link.name}
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
              className="inline-flex items-center gap-1 p-0 font-medium text-muted-foreground text-sm hover:bg-transparent hover:text-foreground"
              variant="ghost"
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
                      className="before:absolute before:inset-0"
                      href={info.href}
                      prefetch={false}
                      target={info.href.startsWith("http") ? "_blank" : ""}
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
                    href={info.href}
                    icon={info.icon}
                    key={info.name}
                    name={info.name}
                    onClick={props.onLinkClick}
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
      className={clsx(
        "font-medium text-base transition-colors hover:text-foreground xl:text-sm",
        pathname.startsWith(props.href)
          ? "text-foreground"
          : "text-muted-foreground",
        props.icon ? "flex flex-row gap-3" : "",
      )}
      href={props.href}
      onClick={props.onClick}
      target={props.href.startsWith("http") ? "_blank" : ""}
    >
      {props.icon ? (
        <>
          <props.icon className="size-6" />
          <span className="my-auto">{props.name}</span>
        </>
      ) : (
        props.name
      )}
    </Link>
  );
}
