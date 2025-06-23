/* eslint-disable @next/next/no-img-element */
import "server-only";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { cn } from "@/lib/utils";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
import { fallbackChainIcon } from "../../../../../../@/utils/chain-icons";

export async function ChainIcon(props: {
  iconUrl?: string;
  className?: string;
}) {
  if (props.iconUrl) {
    let imageLink = fallbackChainIcon;

    const resolved = resolveSchemeWithErrorHandler({
      client: serverThirdwebClient,
      uri: props.iconUrl,
    });

    if (resolved) {
      // check if it loads or not
      const res = await fetch(resolved, {
        headers: DASHBOARD_THIRDWEB_SECRET_KEY
          ? {
              "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
            }
          : {},
        method: "HEAD",
        // revalidate every hour
        next: { revalidate: 60 * 60 },
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
        className={cn("object-contain", props.className)}
        src={imageLink}
      />
    );
  }
  return (
    <img
      alt=""
      className={cn("object-contain", props.className)}
      src={fallbackChainIcon}
    />
  );
}
