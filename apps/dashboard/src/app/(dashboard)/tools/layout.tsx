import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "thirdweb Blockchain Tools",
  description:
    "A collection of EVM development tools to help with blockchain development.",
};

export default function ToolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      sidebarLinks={[
        {
          label: "Transaction Simulator",
          href: "/tools/transaction-simulator",
        },
        {
          label: "Wei Converter",
          href: "/tools/wei-converter",
        },
        {
          label: "Hex Converter",
          href: "/tools/hex-converter",
        },
        {
          label: "Unix Time Converter",
          href: "/tools/unixtime-converter",
        },
        {
          label: "Keccak-256 Converter",
          href: "/tools/keccak256-converter",
        },
      ]}
    >
      {children}
    </SidebarLayout>
  );
}
