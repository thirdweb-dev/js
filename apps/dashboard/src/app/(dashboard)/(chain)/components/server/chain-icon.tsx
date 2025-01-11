/* eslint-disable @next/next/no-img-element */
import "server-only";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/env";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { cn } from "@/lib/utils";
import { fallbackChainIcon } from "../../../../../utils/chain-icons";

export async function ChainIcon(props: {
  iconUrl?: string;
  className?: string;
}) {
  if (props.iconUrl) {
    let imageLink = fallbackChainIcon;

    const resolved = resolveSchemeWithErrorHandler({
      client: getThirdwebClient(),
      uri: props.iconUrl,
    });

    if (resolved) {
      // check if it loads or not
      const res = await fetch(resolved, {
        // revalidate every hour
        next: { revalidate: 60 * 60 },
        method: "HEAD",
        headers: DASHBOARD_THIRDWEB_SECRET_KEY
          ? {
              "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
            }
          : {},
      }).catch(() => null);

      if (res?.status === 200) {
        imageLink = resolved;
        // check that its an image
        const contentType = res.headers.get("content-type");
        if (!contentType?.startsWith("image")) {
          imageLink = fallbackChainIcon;
        }
      }
    }

    return (
      <img
        alt=""
        src={imageLink}
        className={cn("object-contain", props.className)}
      />
    );
  }
  return (
    <img
      alt=""
      src={fallbackChainIcon}
      className={cn("object-contain", props.className)}
    />
  );
}
