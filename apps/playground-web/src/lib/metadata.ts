import type { Metadata } from "next";
import { getBaseUrl } from "./env";

const BASE_URL = getBaseUrl();

type DynamicImageOptions = {
  title: string;
  icon: "wallets" | "transactions" | "payments" | "insight" | "contract";
};

export function createMetadata(obj: {
  title: string;
  description: string;
  image?: DynamicImageOptions;
}): Metadata {
  const metaTitle = `${obj.title} | thirdweb Playground`;

  return {
    description: obj.description,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      description: obj.description,
      images: obj.image
        ? [
            {
              height: 630,
              url: `${BASE_URL}/api/og?icon=${obj.image.icon}&title=${obj.image.title}`,
              width: 1200,
            },
          ]
        : undefined,
      locale: "en_US",
      siteName: "thirdweb Playground",
      title: metaTitle,
      type: "website",
    },
    title: metaTitle,
    twitter: {
      card: "summary_large_image",
      creator: "@thirdweb",
      description: obj.description,
      site: "@thirdweb",
      title: metaTitle,
    },
  };
}
