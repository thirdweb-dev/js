import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  AlbumIcon,
  ArrowLeftRightIcon,
  BracesIcon,
  CircleDollarSignIcon,
  CodeIcon,
  FlaskConicalIcon,
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
      href: `${paySlug}/overview`,
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
          name: "ConnectButton",
          href: `${paySlug}/get-started#option-1-connectbutton`,
        },
        {
          name: "Embed",
          href: `${paySlug}/get-started#option-2-embed-pay`,
        },
        {
          name: "Send a Transaction",
          href: `${paySlug}/get-started#option-3-send-a-transaction-with-pay`,
        },
      ],
    },
    {
      name: "Tutorials",
      isCollapsible: true,
      icon: <AlbumIcon />,
      links: [
        {
          name: "Accept Direct Payments",
          href: `${paySlug}/guides/accept-direct-payments`,
        },
        {
          name: "Build a Custom Onramp Experience",
          href: `${paySlug}/guides/build-a-custom-experience`,
        },
        {
          name: "Cross-Chain Swapping",
          href: `${paySlug}/guides/cross-chain-swapping`,
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
      name: "Developer Mode",
      href: `${paySlug}/testing-pay`,
      icon: <FlaskConicalIcon />,
    },
    {
      name: "FAQs",
      href: `${paySlug}/faqs`,
      icon: <MessageCircleQuestionIcon />,
    },
  ],
};
