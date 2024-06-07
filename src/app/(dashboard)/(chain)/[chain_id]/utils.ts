import "server-only";

import { THIRDWEB_API_HOST } from "constants/urls";
import { ChainMetadataWithServices } from "../types/chain";
import { redirect } from "next/navigation";

export async function getChain(
  chainIdOrSlug: string,
): Promise<ChainMetadataWithServices> {
  const res = await fetch(
    `${THIRDWEB_API_HOST}/v1/chains/${chainIdOrSlug}?includeServices=true`,
  );

  const result = await res.json();
  if (!result.data) {
    redirect("/404");
  }
  return result.data as ChainMetadataWithServices;
}
