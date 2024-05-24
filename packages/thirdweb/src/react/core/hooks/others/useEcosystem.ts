import { useQuery } from "@tanstack/react-query";
import {
  getThirdwebDomains,
  setThirdwebDomains,
} from "../../../../utils/domains.js";
import type { InAppWalletEcosystem } from "../../../../wallets/in-app/core/wallet/types.js";

/**
 * @internal
 */
export function useEcosystem(options: { integratorId?: string }) {
  const { integratorId } = options;
  setThirdwebDomains({ inAppWallet: "embedded-wallet.thirdweb-dev.com" });
  return useQuery({
    queryKey: ["ecosystem", integratorId],
    queryFn: async (): Promise<InAppWalletEcosystem> => {
      if (!integratorId) return {}; // we shouldn't ever hit this because of the enabled param
      const headers = new Headers();
      headers.set("x-integrator-id", integratorId);
      const res = await fetch(
        `https://${
          getThirdwebDomains().inAppWallet
        }/api/2024-05-05/ecosystem-wallet/provider/detail`,
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
