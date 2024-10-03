import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import type { Metadata } from "next";
import { getAbsoluteUrl } from "../../../../../lib/vercel-utils";

export default function Layout(props: { children: React.ReactNode }) {
  return <ChakraProviderSetup>{props.children}</ChakraProviderSetup>;
}

const seo = {
  title: "The Complete Account Abstraction Toolkit | thirdweb",
  desc: "Add account abstraction to your web3 app & unlock powerful features for seamless onboarding, customizable transactions, & maximum security. Get started.",
};

export const metadata: Metadata = {
  title: seo.title,
  description: seo.desc,
  openGraph: {
    title: seo.title,
    description: seo.desc,
    images: [
      {
        url: `${getAbsoluteUrl()}/assets/og-image/dashboard-wallets-smart-wallet.png`,
        width: 1200,
        height: 630,
        alt: seo.title,
      },
    ],
  },
};
