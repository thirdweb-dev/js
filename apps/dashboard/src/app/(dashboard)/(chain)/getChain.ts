import { THIRDWEB_API_HOST } from "constants/urls";
import { redirect } from "next/navigation";
import type { ChainMetadataWithServices } from "./types/chain";

export async function getChain(
  chainIdOrSlug: string,
): Promise<ChainMetadataWithServices> {
  const res = await fetch(
    `${THIRDWEB_API_HOST}/v1/chains/${chainIdOrSlug}?includeServices=true`,
    // revalidate every 15 minutes
    { next: { revalidate: 15 * 60 } },
  );

  const result = await res.json();
  if (!result.data) {
    redirect("/404");
  }
  return result.data as ChainMetadataWithServices;
}
