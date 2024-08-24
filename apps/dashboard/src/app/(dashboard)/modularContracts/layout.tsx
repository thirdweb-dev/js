import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "thirdweb Blockchain Modular Contracts",
  description:
    "A collection of pre-built NFTs",
};

export default function ToolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col h-full gap-8">
      <main className="container pb-20 flex-1">
        <div className="h-14" />
        <div className="h-8" />
        <div>{children}</div>
      </main>
    </section>
  );
}
