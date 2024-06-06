import { useQuery } from "@tanstack/react-query";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import type { InAppWalletEcosystem } from "../../../../wallets/in-app/core/wallet/types.js";

/**
 * @internal
 */
export function useEcosystem(options: { integratorId?: string }) {
  const { integratorId } = options;
  return useQuery({
    queryKey: ["ecosystem", integratorId],
    queryFn: async (): Promise<InAppWalletEcosystem> => {
      if (!integratorId) return {}; // we shouldn't ever hit this because of the enabled param
      const headers = new Headers();
      headers.set("x-integrator-id", integratorId);
      const res = await fetch(
        `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/ecosystem-wallet`,
        {
          headers,
        },
      );
      const data = await res.json();
      return {
        imageUrl: data.imageUrl as string | undefined,
        name: data.name as string | undefined,
      };
    },
    enabled: !!integratorId,
  });
}
