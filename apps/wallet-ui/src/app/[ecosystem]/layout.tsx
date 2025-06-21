import type { Metadata, ResolvingMetadata } from "next";
import { getEcosystemInfo } from "@/lib/ecosystems";

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
    description: `Access your ${ecosystem.name} wallet.`,
    icons: {
      icon: ecosystem.imageUrl,
    },
    openGraph: {
      images: [ecosystem.imageUrl, ...previousImages],
    },
    title: ecosystem.name,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
