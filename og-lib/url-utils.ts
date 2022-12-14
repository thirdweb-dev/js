import { getAbsoluteUrl } from "lib/vercel-utils";

export interface OGImageRelease {
  name: string;
  version: string;
  publishDate: string;
  publisher: string;
  logo?: string;
  description?: string;
  publisherAvatar?: string;
  extension?: string | string[];
  license?: string | string[];
}

type OgProps = {
  release: OGImageRelease;
};

function toUrl<TOgType extends keyof OgProps>(
  type: TOgType,
  props: OgProps[TOgType],
): URL {
  const url = new URL(`${getAbsoluteUrl()}/api/og/${type}`);
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, item));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });
  url.searchParams.sort();
  return url;
}

function fromUrl<TOgType extends keyof OgProps>(
  type: TOgType,
  url: URL,
): OgProps[TOgType] {
  switch (type) {
    case "release":
      return {
        name: url.searchParams.get("name") || "",
        version: url.searchParams.get("version") || "",
        publishDate: url.searchParams.get("publishDate") || "",
        publisher: url.searchParams.get("publisher") || "",
        logo: url.searchParams.get("logo") || undefined,
        description: url.searchParams.get("description") || undefined,
        publisherAvatar: url.searchParams.get("publisherAvatar") || undefined,
        extension: url.searchParams.getAll("extension"),
        license: url.searchParams.getAll("license"),
      };
    default:
      throw new Error(`Unknown OG type: ${type}`);
  }
}

export const ReleaseOG = {
  toUrl: (props: OgProps["release"]) => toUrl("release", props),
  fromUrl: (url: URL) => fromUrl("release", url),
};
