import type { Metadata } from "next";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { TeamHeader } from "../../team/components/TeamHeader/team-header";

export const metadata: Metadata = {
  description:
    "A collection of EVM development tools to help with blockchain development.",
  title: "thirdweb Blockchain Tools",
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b bg-card">
        <TeamHeader />
      </div>
      <SidebarLayout
        sidebarLinks={[
          {
            href: "/tools/transaction-simulator",
            label: "Transaction Simulator",
          },
          {
            href: "/tools/wei-converter",
            label: "Wei Converter",
          },
          {
            href: "/tools/hex-converter",
            label: "Hex Converter",
          },
          {
            href: "/tools/unixtime-converter",
            label: "Unix Time Converter",
          },
          {
            href: "/tools/keccak256-converter",
            label: "Keccak-256 Converter",
          },
        ]}
      >
        {children}
      </SidebarLayout>
    </div>
  );
}
