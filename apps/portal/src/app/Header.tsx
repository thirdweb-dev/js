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
import { ChevronDownIcon, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GithubIcon } from "../components/Document/GithubButtonLink";
import { CustomAccordion } from "../components/others/CustomAccordion";
import { ThemeSwitcher } from "../components/others/theme/ThemeSwitcher";
import { ThirdwebIcon } from "../icons/thirdweb";

const links = [
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
    name: "Account",
    href: "/account",
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

export const connectLinks = [
  {
    name: "Overview",
    href: "/connect",
    icon: "/icons/navbar/nav-icon-dashboard.svg",
  },
  {
    name: "TypeScript",
    href: "/typescript/v5",
    icon: "/icons/navbar/nav-icon-typescript.svg",
  },
  {
    name: "React",
    href: "/react/v5",
    icon: "/icons/navbar/nav-icon-react.svg",
  },
  {
    name: "React Native",
    href: "/react-native/v5",
    icon: "/icons/navbar/nav-icon-react.svg",
    // icon: "/icons/navbar/nav-icon-react-native.svg",
  },
  {
    name: ".NET",
    href: "/dotnet",
    icon: "/icons/navbar/nav-icon-dotnet.svg",
  },
  {
    name: "Unity",
    href: "/unity",
    icon: "/icons/navbar/nav-icon-unity.svg",
  },
  {
    name: "Unreal Engine",
    href: "/unreal-engine",
    icon: "/icons/navbar/nav-icon-unreal-engine.svg",
  },
] as const;

const supportLinks = [
  {
    name: "Get thirdweb support",
    href: "https://thirdweb.com/support",
  },
  {
    name: "Knowledge Base",
    href: "https://support.thirdweb.com",
  },
  {
    name: "Contact Sales",
    href: "https://thirdweb.com/contact-us",
  },
];

export function Header() {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);

  return (
    <header className="flex w-full items-center border-b bg-b-900">
      <div className="container flex items-center justify-between gap-6 p-4 xl:justify-start">
        <Link
          className="flex items-center gap-2"
          href="/"
          aria-label="thirdweb Docs"
          title="thirdweb Docs"
        >
          <ThirdwebIcon className="size-8" />
          <span className="font-bold text-[23px] text-f-100 leading-none tracking-tight">
            Docs
          </span>
        </Link>

        <div className="flex items-center gap-1 xl:hidden">
          <ThemeSwitcher className="border-none bg-transparent" />

          <DocSearch variant="icon" />

          <Link
            href="https://github.com/thirdweb-dev"
            target="_blank"
            className="text-f-100"
          >
            <GithubIcon className="mx-3 size-6" />
          </Link>

          {/* Mobile burger menu */}
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => setShowBurgerMenu(!showBurgerMenu)}
          >
            <Menu className="size-7" />
          </Button>
        </div>

        <nav
          className={clsx(
            "grow gap-5",
            !showBurgerMenu ? "hidden xl:flex" : "flex",
            "fade-in-20 slide-in-from-top-3 fixed inset-0 top-sticky-top-height animate-in flex-col overflow-auto bg-b-800 p-6",
            "xl:static xl:animate-none xl:flex-row xl:justify-between xl:bg-transparent xl:p-0",
          )}
        >
          <ul className="flex flex-col gap-5 xl:flex-row xl:items-center">
            <DropdownLinks
              links={connectLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
              category="Connect"
            />

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

            <DropdownLinks
              links={toolLinks}
              onLinkClick={() => setShowBurgerMenu(false)}
              category="Tools"
            />
          </ul>

          <div className="flex flex-col justify-start gap-5 xl:flex-row xl:items-center xl:gap-3">
            <div className="hidden xl:flex">
              <ThemeSwitcher />
            </div>

            <div className="hidden xl:block">
              <DocSearch variant="search" />
            </div>

            <div className="xl:px-2">
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

            <Link
              href="https://github.com/thirdweb-dev"
              target="_blank"
              className="hidden text-f-300 transition-colors hover:text-f-100 xl:block"
            >
              <GithubIcon className="mx-2 size-6" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function DropdownLinks(props: {
  onLinkClick?: () => void;
  category: string;
  links: readonly { name: string; href: string; icon?: string }[];
}) {
  return (
    <>
      {/* desktop */}
      <div className="hidden items-center xl:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="inline-flex items-center gap-1 p-0 font-medium text-f-300 text-sm hover:bg-transparent hover:text-f-100"
            >
              {props.category}
              <ChevronDownIcon className="size-4 text-f-300 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="flex flex-col gap-1 bg-b-800 p-3"
            style={{
              minWidth: "150px",
            }}
          >
            {props.links.map((info) => {
              return (
                <DropdownMenuItem asChild key={info.name}>
                  <Link
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : ""}
                    prefetch={false}
                    className={clsx(
                      "flex cursor-pointer font-medium text-f-200",
                      "hover:bg-b-600 hover:text-f-100",
                    )}
                  >
                    {info.icon && (
                      <Image
                        src={info.icon}
                        width="20"
                        height="20"
                        alt=""
                        className="mr-2"
                      />
                    )}
                    {info.name}
                  </Link>
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
          triggerContainerClassName="py-0 text-base font-medium text-f-300"
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
  icon?: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={props.href}
      onClick={props.onClick}
      target={props.href.startsWith("http") ? "_blank" : ""}
      className={clsx(
        "font-medium text-base transition-colors hover:text-f-100 xl:text-sm",
        pathname === props.href ? "text-f-100" : "text-f-300 ",
        props.icon ? "flex flex-row gap-2" : "",
      )}
    >
      {props.icon ? (
        <>
          <Image
            src={props.icon}
            width="40"
            height="40"
            className="size-7"
            alt=""
          />
          <span className="my-auto">{props.name}</span>
        </>
      ) : (
        props.name
      )}
    </Link>
  );
}
