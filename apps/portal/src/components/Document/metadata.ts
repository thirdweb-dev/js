import type { Metadata } from "next";
import { getBaseUrl } from "../../lib/getBaseUrl";

const BASE_URL = getBaseUrl();

type DynamicImageOptions = {
  title: string;
  icon:
    | "thirdweb"
    | "react"
    | "typescript"
    | "unity"
    | "solidity"
    | "wallets"
    | "auth"
    | "contract"
    | "payment"
    | "infra"
    | "rpc"
    | "storage"
    | "changelog"
    | "dotnet"
    | "nebula"
    | "unreal-engine"
    | "insight"
    | "webhooks";
};

export type MetadataImageIcon = DynamicImageOptions["icon"];

export function createMetadata(obj: {
  title: string;
  description: string;
  image?: DynamicImageOptions;
}): Metadata {
  return {
    description: obj.description,
    metadataBase: new URL("https://portal.thirdweb.com"),
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
      siteName: "thirdweb docs",
      title: obj.title,
      type: "website",
    },
    title: obj.title,
    twitter: {
      card: "summary_large_image",
      creator: "@thirdweb",
      description: obj.description,
      site: "@thirdweb",
      title: obj.title,
    },
  };
}
