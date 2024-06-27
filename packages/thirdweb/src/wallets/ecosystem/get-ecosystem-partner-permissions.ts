import { getThirdwebBaseUrl } from "../../utils/domains.js";
import type { EcosystemPermssions } from "../in-app/web/types.js";
import type { EcosystemWalletId } from "../wallet-types.js";

export const getEcosystemPartnerPermissions = async (
  ecosystemId: EcosystemWalletId,
  partnerId?: string,
): Promise<EcosystemPermssions> => {
  const res = await fetch(
    `${getThirdwebBaseUrl(
      "inAppWallet",
    )}/api/2024-05-05/ecosystem-wallet/${ecosystemId}/partner/${partnerId}`,
    {
      headers: {
        "x-ecosystem-id": ecosystemId,
        "x-ecosystem-partner-id": partnerId || "",
      },
    },
  );

  const data = (await res.json()) as EcosystemPermssions;

  return data;
};
