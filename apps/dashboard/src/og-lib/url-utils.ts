import { getAbsoluteUrl } from "lib/vercel-utils";

interface OgImageProfile {
  displayName: string;
  bio?: string;
  avatar?: string;
  publishedCnt?: string;
}

const OG_VERSION = "0.1.0";

type OgProps = {
  profile: OgImageProfile;
};

function toUrl<TOgType extends keyof OgProps>(
  type: TOgType,
  props: OgProps[TOgType],
): URL {
  const url = new URL(`${getAbsoluteUrl()}/api/og/${type}`);
  // biome-ignore lint/complexity/noForEach: FIXME
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        // biome-ignore lint/complexity/noForEach: FIXME
        value.forEach((item) =>
          url.searchParams.append(key.toLowerCase(), item),
        );
      } else {
        url.searchParams.append(key.toLowerCase(), value);
      }
    }
  });
  url.searchParams.sort();
  url.searchParams.append("og_version", OG_VERSION);
  return url;
}

function fromUrl(type: keyof OgProps, url: URL): OgProps[typeof type] {
  switch (type) {
    case "profile":
      return {
        displayName: url.searchParams.get("displayname") || "",
        bio: url.searchParams.get("bio") || undefined,
        avatar: url.searchParams.get("avatar") || undefined,
        publishedCnt: url.searchParams.get("publishedcnt") || undefined,
      } as OgProps["profile"];
    default:
      throw new Error(`Unknown OG type: ${type}`);
  }
}

export const ProfileOG = {
  toUrl: (props: OgProps["profile"]) => toUrl("profile", props),
  fromUrl: (url: URL) => fromUrl("profile", url) as OgProps["profile"],
};
