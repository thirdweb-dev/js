import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import type { SocialAuthOption } from "../../../../wallets/types.js";
import type { Ecosystem } from "../../web/types.js";

export const getSocialAuthLoginPath = (
  authOption: SocialAuthOption,
  client: ThirdwebClient,
  ecosystem?: Ecosystem,
) => {
  const baseUrl = `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/${authOption}?clientId=${client.clientId}`;
  if (ecosystem?.partnerId) {
    return `${baseUrl}&ecosystemId=${ecosystem.id}&ecosystemPartnerId=${ecosystem.partnerId}`;
  }
  if (ecosystem) {
    return `${baseUrl}&ecosystemId=${ecosystem.id}`;
  }
  return baseUrl;
};
