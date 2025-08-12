/* eslint-disable @next/next/no-img-element */
import "server-only";
import { fallbackChainIcon } from "@/constants/chain";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";
import { cn } from "@/lib/utils";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";

export async function ChainIcon(props: {
  iconUrl?: string;
  className?: string;
}) {
  if (props.iconUrl) {
    let imageLink = fallbackChainIcon;

    // Only resolve if we have a secret key available
    const resolved = DASHBOARD_THIRDWEB_SECRET_KEY
      ? resolveSchemeWithErrorHandler({
          client: getConfiguredThirdwebClient({
            secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
            teamId: undefined,
          }),
          uri: props.iconUrl,
        })
      : null;

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
