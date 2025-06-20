import type { ThirdwebClient } from "../../client/client.js";
import { getThirdwebBaseUrl } from "../../utils/domains.js";
import { getClientFetch } from "../../utils/fetch.js";
import { stringify } from "../../utils/json.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";

/**
 * @internal
 */
export async function track({
  client,
  ecosystem,
  data,
}: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  data: object;
}) {
  const fetch = getClientFetch(client, ecosystem);
  const event = {
    source: "sdk",
    ...data,
  };

  return fetch(`${getThirdwebBaseUrl("analytics")}/event`, {
    body: stringify(event),
    method: "POST",
  }).catch(() => {});
}
