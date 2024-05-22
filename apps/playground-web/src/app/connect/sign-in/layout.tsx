import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Integrate Fiat & Cross-Chain Crypto Payments | thirdweb Pay",
  description:
    "The easiest way for users to transact in your app. Onramp users in clicks and generate revenue for each user transaction. Integrate for free.",
  openGraph: {
    images: [
      {
        url: "/og-image-pay.png",
        width: 1200,
        height: 630,
        alt: "Integrate Fiat & Cross-Chain Crypto Payments | thirdweb Pay",
      },
    ],
  },
};

export default function ConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
