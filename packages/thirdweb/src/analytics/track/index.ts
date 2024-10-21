import type { Ecosystem } from "src/wallets/in-app/core/wallet/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { stringify } from "../../utils/json.js";

const ANALYTICS_ENDPOINT = "https://c.thirdweb.com/event";

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

  return fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    body: stringify(event),
  }).catch(() => { });
}
