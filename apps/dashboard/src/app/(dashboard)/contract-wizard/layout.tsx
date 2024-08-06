import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "thirdweb Blockchain Tools",
  description:
    "A wysiwyg contract wizard to help you build your own modular smart contracts.",
};

export default function ContractWizardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col h-full gap-8">
      <main className="container pb-20 flex-1">
        {children}
      </main>
    </section>
  );
}

