import type { SidebarLink } from "../components/ui/sidebar";

export const navLinks: SidebarLink[] = [
  {
    name: "Sign in",
    expanded: true,
    links: [
      {
        name: "Button",
        href: "/connect/sign-in/button",
      },
      {
        name: "Embed",
        href: "/connect/sign-in/embed",
      },
      {
        name: "Headless",
        href: "/connect/sign-in/headless",
      },
    ],
  },
  {
    name: "Account Abstraction",
    href: "/connect/account-abstraction",
  },
  {
    name: "in-App wallet",
    href: "/connect/in-app-wallet",
  },
  {
    name: "Pay",
    href: "/connect/pay",
  },
  {
    name: "Auth",
    href: "/connect/auth",
  },
  {
    name: "Blockchain API",
    href: "/connect/blockchain-api",
  },
];
