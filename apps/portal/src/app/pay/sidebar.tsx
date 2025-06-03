import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  AlbumIcon,
  ArrowLeftRightIcon,
  BracesIcon,
  CircleDollarSignIcon,
  CodeIcon,
  MessageCircleQuestionIcon,
  PaletteIcon,
  RocketIcon,
  TriangleRightIcon,
  WalletIcon,
  WebhookIcon,
} from "lucide-react";

const paySlug = "/pay";

export const sidebar: SideBar = {
  name: "Universal Bridge",
  links: [
    {
      name: "Overview",
      href: `${paySlug}`,
      icon: <WalletIcon />,
    },
    {
      name: "Supported Routes",
      href: "https://thirdweb.com/routes",
      icon: <ArrowLeftRightIcon />,
    },
    {
      name: "Onramp Providers",
      href: `${paySlug}/onramp-providers`,
      icon: <TriangleRightIcon />,
    },
    {
      name: "Service Fees",
      href: `${paySlug}/fees`,
      icon: <CircleDollarSignIcon />,
    },
    {
      name: "Get Started",
      href: `${paySlug}/get-started`,
      icon: <RocketIcon />,
      links: [
        {
          name: "Installation",
          href: `${paySlug}/get-started#installation`,
        },
        {
          name: "Recipes",
          href: `${paySlug}/get-started#recipes`,
        },
      ],
    },
    {
      name: "Tutorials",
      isCollapsible: true,
      icon: <AlbumIcon />,
      links: [
        {
          name: "Cross-Chain Swapping",
          href: `${paySlug}/guides/cross-chain-swapping`,
        },
        {
          name: "Swap with Smart Accounts",
          href: `${paySlug}/guides/smart-accounts`,
        },
        {
          name: "Fiat Onramp",
          href: `${paySlug}/guides/onramp-integration`,
        },
        {
          name: "NFT Checkout",
          href: `${paySlug}/guides/nft-checkout`,
        },
      ],
    },
    {
      name: "Customization",
      isCollapsible: true,
      icon: <PaletteIcon />,
      links: [
        {
          name: "ConnectButton",
          href: `${paySlug}/customization/connectbutton`,
        },
        {
          name: "PayEmbed",
          href: `${paySlug}/customization/payembed`,
        },
        {
          name: "useSendTransaction",
          href: `${paySlug}/customization/send-transaction`,
        },
      ],
    },
    {
      name: "API Reference",
      href: "https://bridge.thirdweb.com/reference",
      icon: <BracesIcon />,
    },
    {
      name: "SDK Reference",
      href: "/typescript/v5/buy/quote",
      icon: <CodeIcon />,
      links: [
        {
          name: "TypeScript SDK",
          href: "/typescript/v5/buy/quote",
        },
      ],
    },
    {
      name: "Webhooks",
      href: `${paySlug}/webhooks`,
      icon: <WebhookIcon />,
    },
    {
      name: "FAQs",
      href: `${paySlug}/faqs`,
      icon: <MessageCircleQuestionIcon />,
    },
  ],
};
