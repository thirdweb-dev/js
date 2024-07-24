import type { Metadata } from "next";
import { ToolsTabs } from "./components/tabs";

export const metadata: Metadata = {
  title: "thirdweb Blockchain Tools",
  description:
    "A collection of EVM development tools to help with blockchain development.",
};

export default function ToolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col h-full gap-8">
      <main className="container pb-20 flex-1">
        <div className="h-14" />
        <ToolsTabs />
        <div className="h-8" />
        <div>{children}</div>
      </main>
    </section>
  );
}
