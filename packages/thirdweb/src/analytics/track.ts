import type { ThirdwebClient } from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";

const ANALYTICS_ENDPOINT = "https://c.thirdweb.com/event";

/**
 * @internal
 */
export function track(client: ThirdwebClient, data: object) {
  const fetch = getClientFetch(client);

  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data, (_key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    }),
  });
}
