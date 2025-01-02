import { getEcosystemInfo } from "@/lib/ecosystems";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ ecosystem: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const [ecosystem, parentMetadata] = await Promise.all([
    getEcosystemInfo(params.ecosystem),
    parent,
  ]);
  const previousImages = parentMetadata.openGraph?.images || [];

  return {
    title: ecosystem.name,
    description: `Access your ${ecosystem.name} wallet.`,
    openGraph: {
      images: [ecosystem.imageUrl, ...previousImages],
    },
    icons: {
      icon: ecosystem.imageUrl,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
