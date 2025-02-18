import type { Metadata } from "next";
import { getBaseUrl } from "../../lib/getBaseUrl";

const BAST_URL = getBaseUrl();

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
    | "insight";
};

export type MetadataImageIcon = DynamicImageOptions["icon"];

export function createMetadata(obj: {
  title: string;
  description: string;
  image?: DynamicImageOptions;
}): Metadata {
  return {
    title: obj.title,
    description: obj.description,
    metadataBase: new URL("https://portal.thirdweb.com"),
    twitter: {
      title: obj.title,
      description: obj.description,
      creator: "@thirdweb",
      site: "@thirdweb",
      card: "summary_large_image",
    },
    openGraph: {
      title: obj.title,
      description: obj.description,
      locale: "en_US",
      type: "website",
      siteName: "thirdweb docs",
      images: obj.image
        ? [
            {
              url: `${BAST_URL}/api/og?icon=${obj.image.icon}&title=${obj.image.title}`,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    },
  };
}
