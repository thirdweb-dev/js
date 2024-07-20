import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import type { Ecosystem } from "../../web/types.js";

// TODO: make this generic for all auth providers
export const getDiscordLoginPath = (
  client: ThirdwebClient,
  ecosystem?: Ecosystem,
) => {
  const baseUrl = `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/discord?clientId=${client.clientId}`;
  if (ecosystem?.partnerId) {
    return `${baseUrl}&ecosystemId=${ecosystem.id}&ecosystemPartnerId=${ecosystem.partnerId}`;
  }
  if (ecosystem) {
    return `${baseUrl}&ecosystemId=${ecosystem.id}`;
  }
  return baseUrl;
};
